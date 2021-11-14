import { Link } from 'react-router-dom';
import LetterEditor from '../components/LetterEditor/LetterEditor';

const AppPage = () => {
  return (
    <div className="flex flex-col">
      <Link to="/user">Update account</Link>
      <p>New letter:</p>
      <LetterEditor />
    </div>
  );
};

export default AppPage;
