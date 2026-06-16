import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import apiClient from './client';

// ── 서버에서 받아온 Cognito 설정 캐시 ──
interface CognitoConfig {
  mockMode: boolean;
  region: string;
  userPoolId: string | null;
  clientId: string | null;
}

let cachedConfig: CognitoConfig | null = null;
let userPool: CognitoUserPool | null = null;

/**
 * 백엔드 /api/auth/config 에서 Cognito 설정을 가져와 캐싱합니다.
 * forceRefresh가 true이면 캐시를 건너뛰고 강제 조회합니다.
 */
export async function fetchCognitoConfig(forceRefresh: boolean = false): Promise<CognitoConfig> {
  if (!forceRefresh && cachedConfig) return cachedConfig;

  const res = await apiClient.get('/api/auth/config');
  cachedConfig = res.data as CognitoConfig;

  // Cognito 모드일 때 UserPool 초기화, Mock 모드일 때 해제
  if (!cachedConfig.mockMode && cachedConfig.userPoolId && cachedConfig.clientId) {
    userPool = new CognitoUserPool({
      UserPoolId: cachedConfig.userPoolId,
      ClientId: cachedConfig.clientId,
    });
  } else {
    userPool = null;
  }

  return cachedConfig;
}

/** Mock 모드 여부 (fetchCognitoConfig 호출 후 사용) */
export function isMockMode(): boolean {
  return cachedConfig?.mockMode ?? true;
}

// ── Cognito 인증 결과 타입 ──
export interface CognitoLoginResult {
  idToken: string;     // 실제 JWT (Bearer 토큰으로 사용)
  sub: string;         // Cognito User ID (UUID)
  email: string;
  name: string;
}

/**
 * Cognito SDK로 직접 로그인합니다.
 * 성공 시 실제 JWT idToken과 유저 정보를 반환합니다.
 */
export function cognitoLogin(username: string, password: string): Promise<CognitoLoginResult> {
  return new Promise((resolve, reject) => {
    if (!userPool) {
      reject(new Error('Cognito UserPool이 초기화되지 않았습니다. fetchCognitoConfig()를 먼저 호출하세요.'));
      return;
    }

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        const idToken = session.getIdToken().getJwtToken();
        const payload = session.getIdToken().payload;

        resolve({
          idToken,
          sub: payload.sub as string,
          email: (payload.email as string) || '',
          name: (payload.name as string) || (payload['cognito:username'] as string) || username,
        });
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

/**
 * Cognito User Pool에 새 유저를 등록합니다.
 * (이메일 인증 비활성화 → 즉시 등록 완료)
 */
export function cognitoSignUp(
  username: string,
  password: string,
  email: string,
  name: string,
  phone?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!userPool) {
      reject(new Error('Cognito UserPool이 초기화되지 않았습니다.'));
      return;
    }

    const attributes: CognitoUserAttribute[] = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'name', Value: name }),
    ];

    if (phone) {
      const cleaned = phone.replace(/\D/g, '');
      let formattedPhone = cleaned;

      // 1. '010'으로 시작하는 경우 -> '8210...' 으로 변환
      if (cleaned.startsWith('0')) {
        formattedPhone = '82' + cleaned.slice(1);
      }

      // 2. Cognito는 보통 앞에 '+'를 붙여서 E.164를 완성함
      formattedPhone = '+' + formattedPhone;

      console.log("✅ Cognito로 보내는 최종 번호:", formattedPhone);
      attributes.push(new CognitoUserAttribute({ Name: 'phone_number', Value: formattedPhone }));
    }

    userPool.signUp(username, password, attributes, [], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      const sub = result?.userSub || '';
      resolve(sub);
    });
  });
}

/**
 * Cognito 이메일 인증코드를 검증하여 가입을 확정합니다.
 */
export function cognitoConfirmSignUp(username: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!userPool) {
      reject(new Error('Cognito UserPool이 초기화되지 않았습니다.'));
      return;
    }

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

/**
 * Cognito 이메일 인증코드를 재전송합니다.
 */
export function cognitoResendConfirmationCode(username: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!userPool) {
      reject(new Error('Cognito UserPool이 초기화되지 않았습니다.'));
      return;
    }

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.resendConfirmationCode((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

