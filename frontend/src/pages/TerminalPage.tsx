import { Modal } from '@mui/material';
import { useContext, useState } from 'react';
import ILetter from '../models/Letter';
import LetterContext from '../contexts/LetterContext';
import LetterEditor from 'src/components/LetterEditor/LetterEditor';
import Terminal from 'terminal-in-react';
import ITopic from 'src/models/Topic';

const TerminalPage = () => {
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [freshLetters, setFreshLetters] = useState<ILetter[]>([]);
  const [topics, setTopics] = useState<ITopic[]>([]);
  const { getNewLetters, markLetterViewed, getAllTopics } =
    useContext(LetterContext);

  return (
    <div className="h-full w-full">
      <Terminal
        color="green"
        backgroundColor="black"
        barColor="black"
        hideTopBar={true}
        allowTabs={false}
        commands={{
          ls: (args: string[], print: any, runCommand: any) => {
            const arg = args[1];
            if (arg === '-l') {
              // if the letter flag is set
              getNewLetters()
                .then((result) => {
                  setFreshLetters(result);
                  result.map((letter, index) =>
                    print(create_letter_string(letter, index))
                  );
                })
                .catch(alert);
            } else if (arg === '-t') {
              // if the topic flag is set
              getAllTopics()
                .then((result) => {
                  setTopics(result);
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
      />
      <Modal keepMounted open={editorOpen} onClose={() => setEditorOpen(false)}>
        <LetterEditor />
      </Modal>
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
