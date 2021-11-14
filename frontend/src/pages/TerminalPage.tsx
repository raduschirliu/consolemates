import { CircularProgress, Dialog, DialogTitle } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import LetterEditor from 'src/components/LetterEditor/LetterEditor';
import LetterContext from 'src/contexts/LetterContext';
import ILetter from 'src/models/Letter';
import Terminal from 'terminal-in-react';
import ITopic from 'src/models/Topic';
import mugImage from 'src/assets/mug.png';
import monitorImage from 'src/assets/monitor.png';
import noteImage from 'src/assets/note.png';
import './TerminalPage.css';
import { useAuth0 } from '@auth0/auth0-react';
import IStats from 'src/models/Stats';
import LetterStats from 'src/components/LetterStats/LetterStats';

interface IEditorState {
  open: boolean;
  replyTo: ILetter | null;
}

interface IGraphState {
  open: boolean;
  stats: IStats;
}

const TerminalPage = () => {
  const [editorState, setEditorState] = useState<IEditorState>({
    open: false,
    replyTo: null,
  });
  const [graphState, setGraphState] = useState<IGraphState>({
    open: false,
    stats: { angry: 0, sad: 0, happy: 0, surprise: 0, fear: 0 },
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
    getStats,
  } = useContext(LetterContext);
  const newLetters = useRef<ILetter[]>([]);
  const allTopics = useRef<ITopic[]>([]);
  const { logout } = useAuth0();

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
    <div className="terminal-page">
      <div
        className={`terminal-monitor ${
          fullScreen ? 'terminal-container-fullscreen' : ''
        }`}
        style={{ backgroundImage: `url(${monitorImage})` }}
      >
        <div
          // style={{ backgroundImage: `url(${mugImage})` }}
          className={`terminal-container ${
            fullScreen ? 'terminal-container-fullscreen' : ''
          }`}
        >
          {isAuthValid() ? (
            <Terminal
              color="#00BE68"
              backgroundColor="black"
              barColor="black"
              msg="Type 'help' for a list of commands!"
              style={{
                fontSize: fullScreen ? '1.75em' : '1.3em',
                height: fullScreen ? '100%' : '75%',
              }}
              allowTabs={false}
              // Nice, the types are wrong for this... it should be plural
              // @ts-ignore
              descriptions={{
                ls: 'see a list of all topics or newly received letters',
                logout: 'logout',
                touch: 'create a new letter or reply to an existing one',
                'set-topics': 'update the topics you will receive letters on',
                cat: 'view the contents of a letter',
                rm: 'remove a letter (permanently)',
                stats:
                  'see a breakdown of all the emotional sentiments shown in all the letters you have sent',
              }}
              commands={{
                logout: () => {
                  logout();
                },
                stats: (args: string[], print: any, runCommand: any) => {
                  if (args.length === 2) {
                    if (args[1] !== 'graph') {
                      print('stats: invalid argument');
                    }

                    getStats()
                      .then((stats: IStats) => {
                        setGraphState({
                          open: true,
                          stats,
                        });
                      })
                      .catch(alert);

                    return;
                  }

                  print(
                    'Here is a breakdown the emotions expressed in your letters:'
                  );

                  getStats()
                    .then((stats: IStats) => {
                      const total =
                        stats.angry +
                        stats.happy +
                        stats.sad +
                        stats.surprise +
                        stats.fear;
                      print('Angry: ' + stats.angry + ' / ' + total);
                      print('Happy: ' + stats.happy + ' / ' + total);
                      print('Sad: ' + stats.sad + ' / ' + total);
                      print('Surprise: ' + stats.surprise + ' / ' + total);
                      print('Fear: ' + stats.fear + ' / ' + total);
                      print(
                        'If you wise to see these more visually in a graph, try the command `stats graph`'
                      );
                    })
                    .catch(alert);
                },
                ls: (args: string[], print: any, runCommand: any) => {
                  if (args.length !== 2) {
                    print('touch: missing operand');
                    print(
                      "Usage: to list letters 'ls -l', or to list topics 'ls -t'"
                    );
                    return;
                  }

                  const arg = args[1];
                  if (arg === '-l') {
                    // if the letter flag is set
                    getNewLetters()
                      .then((result: ILetter[]) => {
                        newLetters.current = result;
                        print('Received letters:');
                        result.map((letter, index) =>
                          print(create_letter_string(letter, index))
                        );
                      })
                      .catch(alert);
                  } else if (arg === '-t') {
                    // if the topic flag is set
                    print('Topics:');
                    allTopics.current.map((topic, index) =>
                      print(create_topic_string(topic, index))
                    );
                  } else {
                    // Otherwise print help
                    print('touch: invalid operand');
                    print(
                      "Usage: to list letters 'ls -l', or to list topics 'ls -t'"
                    );
                  }
                },
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
                      print('set-topics: invalid topic ID');
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
                      print('touch: invalid ID');
                      return;
                    }

                    replyTo = newLetters.current[index];

                    if (replyTo.reply_id) {
                      print(
                        'Cannot reply to a message that has already had a reply'
                      );
                      return;
                    }
                  } else if (args.length > 2) {
                    print('touch: too many arguments');
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
                    print('cat: invalid ID');
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
                    print('cat: invalid ID');
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
                      .then((repliedTo: ILetter) => {
                        printLetter(repliedTo);
                        print('-------');
                        print('Reply:');
                      })
                      .catch(alert)
                      .finally(() => {
                        printLetter(letter);
                      });
                  } else {
                    printLetter(letter);
                  }
                },
                rm: (args: string[], print: any, runCommand: any) => {
                  if (args.length < 2) {
                    print('rm: not enough arguments');
                    print("Usage: Remove letter 'rm [index]'");
                    return;
                  }

                  const arg = args[1];
                  const index = parseInt(arg);

                  if (
                    isNaN(index) ||
                    index < 0 ||
                    index >= newLetters.current.length
                  ) {
                    print('rm: invalid ID');
                    return;
                  }

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
      </div>
      <div className="terminal-mug-container hidden lg:block">
        <img className="terminal-mug" src={mugImage} alt="Mug!!" />
        <div className="terminal-mug-steam-container">
          <div className="terminal-mug-steam terminal-mug-steam-1">~~~</div>
          <div className="terminal-mug-steam terminal-mug-steam-2">~~~</div>
          <div className="terminal-mug-steam terminal-mug-steam-3">~~~</div>
        </div>
      </div>
      <div
        className="terminal-note hidden lg:block"
        style={{ backgroundImage: `url(${noteImage})` }}
      >
        <ul className="pl-5 pt-2 list-disc">
          <li>Enter "help" for a list of commands</li>
          <br />
          <li>Press the green button in the top left for fullscreen</li>
        </ul>
      </div>
      <Dialog
        open={graphState.open}
        onClose={() =>
          setGraphState({
            open: false,
            stats: { angry: 0, sad: 0, happy: 0, surprise: 0, fear: 0 },
          })
        }
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle>Letter Stats</DialogTitle>
        <LetterStats stats={graphState.stats} />
      </Dialog>
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
