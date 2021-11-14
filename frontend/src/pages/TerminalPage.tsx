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

interface IEditorState {
  open: boolean;
  replyTo: ILetter | null;
}

const TerminalPage = () => {
  const [editorState, setEditorState] = useState<IEditorState>({
    open: false,
    replyTo: null,
  });
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const {
    isAuthValid,
    getNewLetters,
    getAllTopics,
    getLetter,
    updateUserTopics,
    showSnackbar,
    markLetterViewed,
  } = useContext(LetterContext);
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
                  print("usage: list letters 'ls -l' | list topics 'ls -t'");
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
              stonks: () => 'stonks',
              'set-topics': (args: string[], print: any, runCommand: any) => {
                if (args.length === 1) {
                  print('Usage: set-topics <topic IDs...>');
                  return;
                }

                const topics = [];

                for (let i = 1; i < args.length; i++) {
                  const index = parseInt(args[i]);

                  if (
                    isNaN(index) ||
                    index < 0 ||
                    index >= allTopics.current.length
                  ) {
                    print('Invalid topic index: ' + index);
                    return;
                  }

                  topics.push(allTopics.current[index]);
                }

                print('Set topics: ' + topics.map((t) => t.name).join(', '));

                updateUserTopics(topics)
                  .then(() => showSnackbar('Updated user topics!', 2500))
                  .catch(alert);
              },
              touch: (args: string[], print: any, runCommand: any) => {
                let replyTo = null;

                if (args.length === 2) {
                  const index = parseInt(args[1]);

                  if (isNaN(index) || index >= newLetters.current.length) {
                    print('Please enter a valid ID');
                    return;
                  }

                  replyTo = newLetters.current[index];

                  if (replyTo.reply_id) {
                    print('Cannot reply to a message that has already had a reply');
                    return;
                  }
                } else if (args.length > 2) {
                  print('Usage: touch [reply ID]');
                  return;
                }

                setEditorState({
                  open: true,
                  replyTo,
                });
              },
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

                const printLetter = (l: ILetter) => {
                  print('Subject: ' + l.subject);
                  print(l.content);
                };

                if (letter.reply_id) {
                  // Get original letter if it exists
                  getLetter(letter.reply_id)
                    .then((repliedTo: ILetter) => {})
                    .catch(alert)
                    .finally(() => {
                      print('-------');
                      print('Reply:');
                      printLetter(letter);
                    });
                } else {
                  printLetter(letter);
                }
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
        open={editorState.open}
        onClose={() => setEditorState({ open: false, replyTo: null })}
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle>Letter Editor</DialogTitle>
        <LetterEditor
          replyTo={editorState.replyTo}
          closeDialog={() => setEditorState({ open: false, replyTo: null })}
        />
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
