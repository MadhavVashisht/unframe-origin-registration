import { useState } from 'react';
import { EventPoster } from './components/EventPoster';
import { RegistrationForm } from './components/RegistrationForm';
import { ConfirmationPass } from './components/ConfirmationPass';
import { BattleMarquee } from './components/BattleMarquee';
import type { SubmissionResult } from './types/registration';

export function App() {
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">
      <BattleMarquee />

      {/* Single-screen non-scrollable desktop workspace */}
      <main className="mx-auto flex w-full max-w-[1360px] flex-1 items-center px-4 py-4 sm:px-6 lg:min-h-0 lg:px-8 lg:py-4">
        <div className="grid w-full grid-cols-1 gap-4 lg:h-full lg:max-h-[700px] lg:grid-cols-12 lg:gap-5">
          <div className="lg:col-span-5 lg:h-full lg:min-h-0">
            <EventPoster />
          </div>

          <div className="lg:col-span-7 lg:h-full lg:min-h-0">
            {submissionResult ? (
              <ConfirmationPass
                result={submissionResult}
                onRegisterAnother={() => setSubmissionResult(null)}
              />
            ) : (
              <RegistrationForm onSuccess={(result) => setSubmissionResult(result)} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
