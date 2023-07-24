
import dynamic from 'next/dynamic';
import {
    Menu,
    Item,
    Separator,
    RightSlot,
} from 'react-contexify';

import 'react-contexify/dist/ReactContexify.css';

const BiCommand = dynamic(() => import('react-icons-ng/bi').then(mod => mod.BiCommand ), { ssr: false })
const BiSearch = dynamic(() => import('react-icons-ng/bi').then(mod => mod.BiSearch ), { ssr: false })
const BiSolidCopy = dynamic(() => import('react-icons-ng/bi').then(mod => mod.BiSolidCopy ), { ssr: false })

const CoExpand = dynamic(() => import('react-icons-ng/co').then(mod => mod.CoExpand ), { ssr: false })

const FlFillIcFluentWindow24Filled = dynamic(() => import('react-icons-ng/fl').then(mod => mod.FlFillIcFluentWindow24Filled ), { ssr: false })
const FlFillIcFluentCut24Filled = dynamic(() => import('react-icons-ng/fl').then(mod => mod.FlFillIcFluentCut24Filled ), { ssr: false })

const LuClipboardPaste = dynamic(() => import('react-icons-ng/lu').then(mod => mod.LuClipboardPaste ), { ssr: false })

const SiPrettier = dynamic(() => import('react-icons-ng/si').then(mod => mod.SiPrettier ), { ssr: false })

const CodeMenu = ({ readOnly }) => {

    return (
        <Menu id={'codeboard'}>
            <Item
                onClick={() =>
                    document.getElementsByClassName('cm-content')[0].dispatchEvent(
                        new KeyboardEvent('keydown', {
                            ctrlKey: true,
                            shiftKey: true,
                            key: 'f',
                        })
                    )
                }>
                <BiSearch style={{ marginRight: '8px' }} /> Find
                <RightSlot className="key">
                    <span className="ctrl">Ctrl</span> <span className="f">F</span>
                </RightSlot>
            </Item>

            <Item
                disabled={readOnly}
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

            <Separator />

            <Item
                disabled={readOnly}
                onClick={() =>
                    window.dispatchEvent(
                        new KeyboardEvent('keydown', {
                            key: 'F8',
                        })
                    )
                }>
                <FlFillIcFluentWindow24Filled style={{ marginRight: '8px' }} /> Zen
                Mode
                <RightSlot className="key">
                    <span className="F8">F8</span>
                </RightSlot>
            </Item>

            <Item
                onClick={() => {
                    if (window.innerHeight == screen.height) document.exitFullscreen();
                    else document.documentElement.requestFullscreen();
                }}>
                <CoExpand style={{ marginRight: '8px' }} /> Toggle fullscreen
            </Item>

            <Separator />
            <Item onClick={() => document.execCommand('cut')}>
                <FlFillIcFluentCut24Filled style={{ marginRight: '8px' }} /> Cut{' '}
                <RightSlot className="key">
                    <span className="ctrl">Ctrl</span> <span className="x">X</span>
                </RightSlot>
            </Item>
            <Item onClick={() => document.execCommand('copy')}>
                <BiSolidCopy style={{ marginRight: '8px' }} /> Copy{' '}
                <RightSlot className="key">
                    <span className="ctrl">Ctrl</span> <span className="c">C</span>
                </RightSlot>
            </Item>
            <Item
                disabled={readOnly}
                onClick={async () => {
                    document.execCommand(
                        'insertText',
                        true /*no UI*/,
                        await navigator.clipboard.readText()
                    );
                }}>
                <LuClipboardPaste style={{ marginRight: '8px' }} /> Paste
                <RightSlot className="key">
                    <span className="ctrl">Ctrl</span> <span className="v">V</span>
                </RightSlot>
            </Item>

            <Separator />
            <Item
                onClick={() => {
                    document.dispatchEvent(
                        new KeyboardEvent('keydown', {
                            ctrlKey: true,
                            key: 'k',
                        })
                    );
                }}>
                <BiCommand style={{ marginRight: '8px' }} /> Cmd Pallete{' '}
                <RightSlot className="key">
                    <span className="ctrl">Ctrl</span> <span className="k">K</span>
                </RightSlot>
            </Item>
        </Menu>
    )
}

export default CodeMenu;