import { Box, Dialog, DialogTitle, Modal } from '@mui/material';
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
      <Dialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle>Letter Editor</DialogTitle>
        <LetterEditor closeDialog={() => setEditorOpen(false)} />
      </Dialog>
    </div>
  );
};

export default TerminalPage;
