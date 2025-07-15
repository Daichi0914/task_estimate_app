const CreateWorkspaceForm = () => {
    return (
        <form className="absolute bottom-0 left-0 right-0 h-[124px] mx-4 my-6 flex flex-col justify-end border-t-1 border-gray-300">
          <input
            type="text"
            name='workspaceName'
            className="w-full p-3 border border-black rounded-lg"
            placeholder='新しいワークスペース'
          />
          <div className="flex justify-between gap-4 mt-4">
            <button
              type='button'
              className="w-full p-1 bg-black hover:bg-gray-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              作成する
            </button>
          </div>
        </form>
    );
};

export default CreateWorkspaceForm;
