'use client';

import { useState } from 'react';
import './chambers.css';

type Answer = 'correct' | 'wrong';

const choices: { label: string; answer: Answer }[] = [
  { label: 'THE OVEN',   answer: 'wrong'   },
  { label: 'THE BOOTS',  answer: 'correct' },
  { label: 'THE SNOW',   answer: 'wrong'   },
  { label: 'THE WINDOW', answer: 'wrong'   },
];

export default function ChambersPage() {
  const [answered, setAnswered] = useState<Answer | null>(null);

  return (
    <>
      <div className="mist" />
      <main className="game-shell">
        <div className="logo-wrap">
          <div className="logo-shadow" />
          <h1 className="logo">MYSTERY KEEP</h1>
          <p className="tagline">THE DAILY DEDUCTION QUEST!</p>
        </div>

        <section className="card">
          <div className="chapter">CHAMBER 01</div>

          <div className="story">
            <p>The royal baker swore nobody entered the kitchen overnight.</p>
            <p>At dawn, the oven was still warm.</p>
            <p>Snow covered the courtyard outside every door and window.</p>
            <p>The guard captain&apos;s boots were completely dry.</p>
          </div>

          <div className="question">WHICH DETAIL PROVES SOMEONE IS LYING?</div>

          <div className="choices">
            {choices.map(({ label, answer }) => (
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
              If nobody entered the kitchen, the guard captain could not have inspected the room.
              Yet his boots are completely dry despite snow covering every entrance.
              Someone entered the castle — and lied about it.
            </div>
          )}

          {answered === 'wrong' && (
            <div className="result wrong">
              <strong>Not quite.</strong>
              <br /><br />
              The contradiction is physical evidence.
              The snow means anyone entering would track in moisture.
              The dry boots expose the lie.
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
