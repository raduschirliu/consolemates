import { Modal } from '@mui/material';
import { useState } from 'react';
import LetterEditor from 'src/components/LetterEditor/LetterEditor';
import Terminal from 'terminal-in-react';

const TerminalPage = () => {
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  return (
    <div>
      <Terminal
        color="green"
        backgroundColor="black"
        barColor="black"
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
