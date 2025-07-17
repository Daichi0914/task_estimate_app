import { useWorkspace } from "@/hooks/useWorkspace";
import { useState } from "react";

const CreateWorkspaceForm = () => {
  const [value, setValue] = useState('');
  const { createWorkspace, error, isLoading } = useWorkspace();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!value.trim()) {
      setLocalError('ワークスペース名を入力してください');
      return;
    }
    try {
      await createWorkspace({ name: value });
      setValue('');
    } catch {
      setLocalError('作成に失敗しました');
    }
  };

  return (
    <form
      className="absolute bottom-0 left-0 right-0 h-[124px] mx-4 my-6 flex flex-col justify-end border-t-1 border-gray-300"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="workspaceName"
        className="w-full p-3 border border-black rounded-lg"
        placeholder="新しいワークスペース"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isLoading}
      />
      {(localError || error) && (
        <div className="text-red-500 text-sm mt-1">{localError || error}</div>
      )}
      <div className="flex justify-between gap-4 mt-4">
        <button
          type="submit"
          className="w-full p-1 bg-black hover:bg-gray-700 text-white rounded-lg transition-colors cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? '作成中...' : '作成する'}
        </button>
      </div>
    </form>
  );
};

export default CreateWorkspaceForm;
