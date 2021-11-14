import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  Modal,
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import LetterEditor from 'src/components/LetterEditor/LetterEditor';
import LetterContext from 'src/contexts/LetterContext';
import ILetter from 'src/models/Letter';
import Terminal from 'terminal-in-react';
import ITopic from 'src/models/Topic';

const TerminalPage = () => {
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const { isAuthValid, getNewLetters, getAllTopics, markLetterViewed } =
    useContext(LetterContext);
  const newLetters = useRef<ILetter[]>([]);
  const allTopics = useRef<ITopic[]>([]);

  useEffect(() => {
    if (!isAuthValid()) return;

    getAllTopics()
      .then((topics: ITopic[]) => {
        allTopics.current = topics;
      })
      .catch(alert);

    getNewLetters()
      .then((letters: ILetter[]) => {
        newLetters.current = letters;
      })
      .catch(alert);
  }, [isAuthValid, newLetters, getNewLetters, allTopics, getAllTopics]);

  return (
    <div className="flex-grow">
      <div
        className={`terminal-container ${
          fullScreen ? 'absolute inset-0 w-full h-full' : ''
        }`}
      >
        {isAuthValid() ? (
          <Terminal
            color="green"
            backgroundColor="black"
            barColor="black"
            style={{ fontSize: fullScreen ? '1.75em' : '1.3em' }}
            allowTabs={false}
            commands={{
              ls: (args: string[], print: any, runCommand: any) => {
                if (args.length < 2) {
                  print("usage: list letters 'ls -l' or list topics 'ls -t'");
                  return;
                }
                const arg = args[1];
                if (arg === '-l') {
                  // if the letter flag is set
                  getNewLetters()
                    .then((result: ILetter[]) => {
                      newLetters.current = result;
                      result.map((letter, index) =>
                        print(create_letter_string(letter, index))
                      );
                    })
                    .catch(alert);
                } else if (arg === '-t') {
                  // if the topic flag is set
                  allTopics.current.map((topic, index) =>
                    print(create_topic_string(topic, index))
                  );
                } else {
                  print('');
                }
              },
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
              rm: (args: string[], print: any, runCommand: any) => {
                if (args.length < 2) {
                  print("usage: remove letter 'rm [index]'");
                  return;
                }

                const arg = args[1];
                const index = parseInt(arg);
                const letter_id_to_remove = newLetters.current[index];

                markLetterViewed(letter_id_to_remove.id)
                  .then((letter_id) => {
                    newLetters.current = newLetters.current.filter(
                      (letter) => letter_id !== letter.id
                    );
                  })
                  .catch(alert);
              },
            }}
            actionHandlers={{
              handleMaximise: (toggleMaximize: () => void) => {
                setFullScreen((prev) => !prev);
                toggleMaximize();
              },
            }}
          />
        ) : (
          <CircularProgress />
        )}
      </div>
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
