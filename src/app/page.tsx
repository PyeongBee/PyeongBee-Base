export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            PyeongBee-Base에 오신 것을 환영합니다
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            자소서 작성과 프로젝트 공유를 위한 플랫폼입니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              자소서 에디터
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              AI 기반 자소서 작성 도구로 완벽한 자기소개서를 작성해보세요.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              시작하기
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              프로젝트 공유
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              여러분의 프로젝트를 다른 사람들과 공유하고 피드백을 받아보세요.
            </p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              공유하기
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              프로필 관리
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              개인 프로필을 관리하고 포트폴리오를 구성해보세요.
            </p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              프로필 설정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
