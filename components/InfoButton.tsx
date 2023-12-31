
// Icons
import dynamic from 'next/dynamic';
import { IconType } from 'react-icons-ng';
const GoGear = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/go').then(mod => mod.GoGear), { ssr: false })

interface MetaTagsProps {
  metadata?: boolean;
  setMetadata?: Function;
}

const InfoButton: React.FC<MetaTagsProps> = ({ metadata, setMetadata } = {metadata: false}) => {
  return (
    <>
      <button
        onContextMenu={(e) => {e.preventDefault()}}
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