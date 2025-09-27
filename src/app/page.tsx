import { Card, CardTitle, CardDescription } from '../components/common/Card';
import { SectionTitle, SectionDescription } from '../components/common/Section';
import { Button } from '../components/common/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="py-8">
        <div className="text-center mb-8">
          <SectionTitle>
            PyeongBee-Base에 오신 것을 환영합니다
          </SectionTitle>
          <SectionDescription>
            자소서 작성과 프로젝트 공유를 위한 플랫폼입니다
          </SectionDescription>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardTitle>자소서 에디터</CardTitle>
            <CardDescription>
              AI 기반 자소서 작성 도구로 완벽한 자기소개서를 작성해보세요.
            </CardDescription>
            <Button variant="primary" className="w-full">
              시작하기
            </Button>
          </Card>

          <Card>
            <CardTitle>프로젝트 공유</CardTitle>
            <CardDescription>
              여러분의 프로젝트를 다른 사람들과 공유하고 피드백을 받아보세요.
            </CardDescription>
            <Button variant="primary" className="w-full bg-green-600 hover:bg-green-700">
              공유하기
            </Button>
          </Card>

          <Card>
            <CardTitle>프로필 관리</CardTitle>
            <CardDescription>
              개인 프로필을 관리하고 포트폴리오를 구성해보세요.
            </CardDescription>
            <Button variant="primary" className="w-full bg-purple-600 hover:bg-purple-700">
              프로필 설정
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
