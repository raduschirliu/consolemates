import { Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import ILetter from '../../models/Letter';

const Letter = ({
  letter,
  loadLetter,
}: {
  letter: ILetter;
  loadLetter: (id: string) => any;
}) => {
  return (
    <div>
      {/* Show button to load previous letter if not root letter */}
      {letter.reply_id ? (
        <Button
          onClick={() => {
            if (loadLetter && letter.reply_id) loadLetter(letter.reply_id);
          }}
        ></Button>
      ) : null}

      {/* Letter content */}
      <ReactMarkdown>{letter.content}</ReactMarkdown>
    </div>
  );
};

export default Letter;
