import { Modal } from '@mui/material';
import { useState } from 'react';
import LetterEditor from 'src/components/LetterEditor/LetterEditor';
import Terminal from 'terminal-in-react';

const TerminalPage = () => {
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  return (
    <div className="flex-grow">
      <h1 className="text-center text-blue-500">Hello</h1>
      <Terminal
        color="green"
        backgroundColor="black"
        barColor="black"
        hideTopBar={true}
        allowTabs={false}
        commands={{
          stonks: () => 'stonks',
          touch: () => setEditorOpen(true),
        }}
      />
      <Modal keepMounted open={editorOpen} onClose={() => setEditorOpen(false)}>
        <LetterEditor />
      </Modal>
    </div>
  );
};

export default TerminalPage;
