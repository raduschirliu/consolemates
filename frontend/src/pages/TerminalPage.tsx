import { useContext, useState } from 'react';
import ILetter from '../models/Letter';
import LetterContext from '../contexts/LetterContext';
import { Box, Dialog, DialogTitle, Modal } from '@mui/material';
import LetterEditor from 'src/components/LetterEditor/LetterEditor';
import Terminal from 'terminal-in-react';
import ITopic from 'src/models/Topic';

const TerminalPage = () => {
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const { getAllTopics, getNewLetters } = useContext(LetterContext);

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
            ls: (args: string[], print: any, runCommand: any) => {
              const arg = args[1];
              if (arg === '-l') {
                // if the letter flag is set
                getNewLetters()
                  .then((result: any[]) => {
                    result.map((letter, index) =>
                      print(create_letter_string(letter, index))
                    );
                  })
                  .catch(alert);
              } else if (arg === '-t') {
                // if the topic flag is set
                getAllTopics()
                  .then((result: any[]) => {
                    result.map((topic, index) =>
                      print(create_topic_string(topic, index))
                    );
                  })
                  .catch(alert);
              } else {
                print('');
              }
            },
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

function create_letter_string(letter: ILetter, index: Number) {
  if (letter.reply_id == null) {
    return '(' + index.toString() + ') ' + letter.subject;
  } else {
    return '(' + index.toString() + ') RE: ' + letter.subject;
  }
}

function create_topic_string(topic: ITopic, index: number): any {
  return '(' + index.toString() + ') ' + topic.name;
}

export default TerminalPage;
