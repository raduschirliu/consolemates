import TopicSelector from '../components/TopicSelector/TopicSelector';

const AppPage = () => {
  return (
    <div className="flex flex-col">
      <p>topics:</p>
      <TopicSelector />
      <p>New letter:</p>
    </div>
  );
};

export default AppPage;
