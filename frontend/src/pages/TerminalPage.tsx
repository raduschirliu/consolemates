import { Box, Dialog, DialogTitle, Modal } from '@mui/material';
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
