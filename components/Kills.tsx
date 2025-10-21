export const Kills = ({ kills }: { kills: number }) => {
  return (
    <div className={`w-full`}>
      <div className="flex items-center justify-between gap-4 mb-2">
        <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
          Zombie kills
        </h6>
        <h6 className="block font-sans text-base antialiased leading-relaxed tracking-normal text-blue-gray-900">
          {kills}
        </h6>
      </div>
    </div>
  );
};
