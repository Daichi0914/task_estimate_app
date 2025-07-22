"use client";

const waveText = "ロード中...";

const LoadingWave = () => (
  <div className="flex min-h-screen items-center justify-center">
    <span className="flex text-2xl font-bold">
      {waveText.split("").map((char, i) => (
        <span
          key={i}
          className="animate-wave"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {char}
        </span>
      ))}
    </span>
  </div>
);

export default LoadingWave;
