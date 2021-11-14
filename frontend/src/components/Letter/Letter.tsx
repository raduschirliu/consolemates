import { Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import ILetter from '../../models/Letter';

const Letter = ({
  letter,
  loadLetter,
  markViewed,
}: {
  letter: ILetter;
  loadLetter: (id: string) => any;
  markViewed: (id: string) => any;
}) => {
  return (
    <div>
      {/* Show button to load previous letter if not root letter */}
      {letter.reply_id ? (
        <Button
          onClick={() => {
            if (letter.reply_id) loadLetter(letter.reply_id);
          }}
        ></Button>
      ) : null}

      {/* Letter content */}
      <p>Subject: {letter.subject}</p>
      <ReactMarkdown children={letter.content} />
      <Button onClick={() => markViewed(letter.id)}>Done</Button>
    </div>
  );
};

export default Letter;
