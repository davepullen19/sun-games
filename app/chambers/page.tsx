'use client';

import { useState } from 'react';
import { getDailyChamber } from './data';
import './chambers.css';

export default function ChambersPage() {
  const chamber = getDailyChamber();
  const [answered, setAnswered] = useState<'correct' | 'wrong' | null>(null);

  return (
    <>
      <div className="mist" />
      <main className="game-shell">
        <div className="logo-wrap">
          <div className="logo-shadow" />
          <h1 className="logo">CHAMBERS</h1>
          <p className="tagline">THE DAILY DEDUCTION QUEST!</p>
        </div>

        <section className="card">
          <div className="chapter">CHAMBER {String(chamber.id).padStart(2, '0')}</div>

          <div className="story">
            {chamber.story.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className="question">{chamber.question}</div>

          <div className="choices">
            {chamber.choices.map(({ label, answer }) => (
              <button
                key={label}
                className="choice"
                disabled={answered !== null}
                onClick={() => setAnswered(answer)}
              >
                {label}
              </button>
            ))}
          </div>

          {answered === 'correct' && (
            <div className="result correct">
              <strong>Correct.</strong>
              <br /><br />
              {chamber.correct}
            </div>
          )}

          {answered === 'wrong' && (
            <div className="result wrong">
              <strong>Not quite.</strong>
              <br /><br />
              {chamber.wrong}
            </div>
          )}

          {answered !== null && (
            <button className="reset" onClick={() => window.location.reload()}>
              TRY ANOTHER CHAMBER
            </button>
          )}
        </section>

        <footer className="footer">
          1 DAILY RIDDLE • 3 GUESSES • STREAKS COMING SOON
        </footer>
      </main>
    </>
  );
}
