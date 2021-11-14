import { Button } from '@mui/material';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Letter from '../components/Letter/Letter';
import LetterEditor from '../components/LetterEditor/LetterEditor';
import LetterContext from '../contexts/LetterContext';
import ILetter from '../models/Letter';

const AppPage = () => {
  const [letters, setLetters] = useState<ILetter[]>([]);
  const { getNewLetters } = useContext(LetterContext);

  return (
    <div className="flex flex-col">
      <Link to="/user">Update account</Link>
      <br />
      <p>New letter:</p>
      <LetterEditor />
      <br />
      <p>Letters:</p>
      <Button
        onClick={() => {
          getNewLetters()
            .then((letters: ILetter[]) => setLetters(letters))
            .catch(alert);
        }}
      >
        Update
      </Button>
      {letters.map((l) => (
        <Letter
          key={l.id}
          letter={l}
          loadLetter={(id: string) => {
            console.log(id);
          }}
        />
      ))}
    </div>
  );
};

export default AppPage;
