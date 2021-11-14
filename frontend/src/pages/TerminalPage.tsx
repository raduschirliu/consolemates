import { Box, Dialog, DialogTitle, Modal } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import LetterEditor from 'src/components/LetterEditor/LetterEditor';
import LetterContext from 'src/contexts/LetterContext';
import ILetter from 'src/models/Letter';
import Terminal from 'terminal-in-react';

const TerminalPage = () => {
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const { isAuthValid, getNewLetters } = useContext(LetterContext);
  const newLetters = useRef<ILetter[]>([]);

  useEffect(() => {
    if (!isAuthValid()) return;

    getNewLetters().then((l) => {
      console.log('got new letters', l);
      newLetters.current = l;
    });
  }, [isAuthValid, newLetters, getNewLetters]);

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
            cat: (args: string[], print: any, runCommand: any) => {
              if (args.length !== 2) {
                print('Usage: cat <ID>');
                return;
              }

              if (newLetters.current.length === 0) {
                print(
                  'No new letters available. Use `ls` to update the list of letters, or wait to get some more!'
                );
                return;
              }

              const index = parseInt(args[1]);

              if (isNaN(index) || index >= newLetters.current.length) {
                print('Please enter a valid ID');
                return;
              }

              const letter = newLetters.current[index];

              if (letter.reply_id) {
                // Get original letter if it exists
                // TODO: do this welp
              }

              print('Subject: ' + letter.subject);
              print('-------');
              print(letter.content);
            },
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
