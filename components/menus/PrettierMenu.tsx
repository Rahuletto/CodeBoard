
import dynamic from 'next/dynamic';
import {
    Item,
    Menu,
    RightSlot,
} from 'react-contexify';

import 'react-contexify/dist/ReactContexify.css';
import { IconType } from 'react-icons-ng';

const SiPrettier = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/si').then(mod => mod.SiPrettier ), { ssr: false })

const PrettierMenu = () => {

    return (
        <Menu id={'prettier'}>
            <Item
                onClick={() =>
                    window.dispatchEvent(
                        new KeyboardEvent('keydown', {
                            altKey: true,
                            key: 'f',
                        })
                    )
                }>
                <SiPrettier style={{ marginRight: '8px' }} /> Format code
                <RightSlot className="key">
                    <span className="alt">Alt</span> <span className="f">F</span>
                </RightSlot>
            </Item>
        </Menu>
    )
}

export default PrettierMenu;