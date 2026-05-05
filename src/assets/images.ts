// 이미지 경로 시 IMAGES['파일명'] 형태로 사용
const imageModules = import.meta.glob('./img/*.{png,jpg,jpeg,svg}', { eager: true });

export const IMAGES: Record<string, string> = Object.entries(imageModules).reduce(
  (acc, [path, module]) => {
    // 경로에서 파일 이름만 추출 (예: './img/main.jpg' -> 'main.jpg')
    const fileName = path.split('/').pop() || '';
    acc[fileName] = (module as any).default;
    return acc;
  },
  {} as Record<string, string>
);