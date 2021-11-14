import { Box, Dialog, DialogTitle, Modal } from '@mui/material';
import { useState } from 'react';
import LetterEditor from 'src/components/LetterEditor/LetterEditor';
import Terminal from 'terminal-in-react';

const TerminalPage = () => {
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  return (
    <div className="flex-grow">
      <h1 className="text-center text-blue-500">Hello</h1>
      <div
        className={`terminal-container ${
          fullScreen ? 'absolute inset-0 w-full h-full' : ''
        }`}
      >
        <Terminal
          color="green"
          backgroundColor="black"
          barColor="black"
          // hideTopBar={true}
          style={{ fontSize: fullScreen ? '1.75em' : '1.3em' }}
          allowTabs={false}
          commands={{
            stonks: () => 'stonks',
            touch: () => setEditorOpen(true),
          }}
          actionHandlers={{
            handleMaximise: (toggleMaximize: () => void) => {
              setFullScreen((prev) => !prev);
              toggleMaximize();
            },
          }}
        />
      </div>
      <h1 className="text-center text-blue-500">Hello</h1>
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
