
// Icons
import { GoGear } from 'react-icons/go';

interface MetaTagsProps {
  metadata?: boolean;
  setMetadata?: Function;
}

const InfoButton: React.FC<MetaTagsProps> = ({ metadata, setMetadata } = {metadata: false}) => {
  return (
    <>
      <button
        title="More info about the project"
        className={['info', 'mobile', metadata ? 'opened' : null].join(' ')}
        onClick={() => {
          setMetadata(!metadata);
        }}>
        <GoGear title="Settings" /> <span>Metadata</span>
      </button>
    </>
  );
};

export default InfoButton;
// Didnt use Million.block as it completely breaks apart