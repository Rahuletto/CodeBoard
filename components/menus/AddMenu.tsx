
import dynamic from 'next/dynamic';
import {
    Item,
    Menu,
    RightSlot,
    Separator
} from 'react-contexify';

import 'react-contexify/dist/ReactContexify.css';
import { IconType } from 'react-icons-ng';

const FaPlus = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/fa').then(mod => mod.FaPlus ), { ssr: false })

const AddMenu = ({ limit }) => {

    return (
        <Menu id={'newfile'}>
            <Item
                onClick={() =>
                    window.dispatchEvent(
                        new KeyboardEvent('keydown', {
                            altKey: true,
                            key: 'n',
                        })
                    )
                }>
                <FaPlus style={{ marginRight: '8px' }} /> Add File
                <RightSlot className="key">
                    <span className="alt">Alt</span> <span className="n">N</span>
                </RightSlot>
            </Item>
            <Separator />
            <Item
                onClick={() => {}}
                disabled
                >
                There is a limit of {limit} files
            </Item>
            
        </Menu>
    )
}

export default AddMenu;