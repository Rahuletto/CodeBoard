import { useEffect, useState } from "react";
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";

import { BiFile, BiRefresh } from "react-icons-ng/bi";
import { FaUserAlt } from "react-icons-ng/fa";
import { HiEye, HiFlag, HiHome, HiLifebuoy, HiMoon, HiPlus, HiSun } from 'react-icons-ng/hi';
import { IoCloseCircleSharp } from "react-icons-ng/io5";
import { Md2RobotExcited } from "react-icons-ng/md2";
import { PiStarFourFill } from "react-icons-ng/pi";
import { SiPrettier } from "react-icons-ng/si";

const Command = ({ router }) => {
    const [cmd, setCmd] = useState(false);
    const [search, setSearch] = useState('');

    const [announce, setAnnounce] = useState('')

    const [theme, setTheme] = useState('');

    const filteredItems = filterItems(
        [
            {
                heading: "What's new",
                id: "update",
                items: [
                    {
                        id: "new",
                        children: "Update Log",
                        icon: PiStarFourFill,
                        closeOnSelect: true,
                        onClick: () => {
                            router.push('/update')
                        }
                    }
                ]
            },
            {
                heading: 'Commands',
                id: 'cmd',
                items: [
                    {
                        id: 'theme',
                        children: 'Change Theme',
                        icon: theme == 'dark' ? HiSun : HiMoon,
                        closeOnSelect: false,
                        onClick: () => {
                            const theme = localStorage.getItem('theme');
                            if (theme == 'light') {
                                localStorage.setItem('theme', 'dark');
                                setTheme('dark');
                                document.documentElement.setAttribute('data-theme', 'dark');
                            } else {
                                localStorage.setItem('theme', 'light');
                                setTheme('light');
                                document.documentElement.setAttribute('data-theme', 'light');
                            }
                            return true;
                        },
                    },
                    {
                        id: 'new-file',
                        children: 'New File',
                        disabled:
                            router.pathname !== '/' && router.pathname !== '/fork/[id]',
                        icon: BiFile,
                        closeOnSelect: true,
                        onClick: () => {
                            document.getElementById('add-file')?.click();
                        },
                    },
                    {
                        id: 'pretty-file',
                        children: 'Format File',
                        disabled:
                            router.pathname !== '/' && router.pathname !== '/fork/[id]',
                        icon: SiPrettier,
                        closeOnSelect: true,
                        onClick: () => {
                            document.getElementById('pretty')?.click();
                        },
                    },
                    {
                        id: 'restart',
                        children: 'Restart',

                        icon: BiRefresh,
                        closeOnSelect: true,
                        onClick: () => {
                            router.reload();
                        },
                    },
                ],
            },
            {
                heading: 'Pages',
                id: 'pages',
                items: [
                    {
                        id: 'home',
                        children: 'Home',
                        icon: HiHome,
                        closeOnSelect: true,
                        onClick: () => {
                            router.push('/home');
                        },
                    },
                    {
                        id: 'new-board',
                        children: 'New Board',
                        icon: HiPlus,
                        closeOnSelect: true,
                        onClick: () => {
                            router.push('/');
                        },
                    },
                    {
                        id: 'privacy-policy',
                        children: 'Privacy policy',
                        icon: HiEye,
                        closeOnSelect: true,
                        onClick: () => {
                            router.push('/privacy');
                        },
                    },
                    {
                        id: 'docs',
                        children: 'API Docs',
                        icon: Md2RobotExcited,
                        closeOnSelect: true,
                        onClick: () => {
                            router.push('/docs');
                        },
                    },
                    {
                        id: 'account',
                        children: 'Account',
                        closeOnSelect: true,
                        icon: FaUserAlt,
                        onClick: () => {
                            router.push('/account');
                        },
                    },
                ],
            },
            {
                heading: 'Help',
                id: 'help',
                items: [
                    {
                        id: 'support',
                        children: 'Support',
                        icon: HiLifebuoy,
                        closeOnSelect: true,
                        onClick: () => {
                            router.push('/email');
                        },
                    },
                    {
                        id: 'feedback',
                        children: 'Send Feedback',
                        icon: HiFlag,
                        closeOnSelect: true,
                        onClick: () => {
                            router.push('/discord');
                        },
                    },
                ],
            },
        ],
        search
    );

    useEffect(() => {
        setAnnounce(localStorage.getItem('announcement'))

        function handleKeyDown(event: KeyboardEvent) {
            if (
                (event.ctrlKey && event.shiftKey && event.key.toLowerCase() == 'p') ||
                (event.ctrlKey && event.key.toLowerCase() == 'g') ||
                (event.ctrlKey && event.key.toLowerCase() == 'k' && !event.shiftKey) ||
                event.key.toLowerCase() == 'f10'
            ) {
                event.preventDefault();
                event.stopPropagation();

                setCmd((currentValue) => {
                    return !currentValue;
                });
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <CommandPalette
            search={search}
            onChangeSearch={setSearch}
            onChangeOpen={setCmd}
            isOpen={cmd}
            page={'root'}>
            <CommandPalette.Page id="root">
                {announce !== "done" ? <div className="new-search">
                    <div className="announce">
                        <h2>Welcome to Command Pallete</h2>
                        <p>
                            This is a part of this new update CodeBoard did. We made it so
                            you can interact with everything just with your keyboard. No
                            more mouse yay !
                        </p>
                    </div>
                    <IoCloseCircleSharp
                        title="Close Warning"
                        style={{ cursor: 'pointer', color: '#17191b', width: "40px", height: "28px" }}
                        onClick={() => {
                            (
                                document.getElementsByClassName('new-search')[0] as HTMLElement
                            ).style.display = 'none';
                            localStorage.setItem('announcement', "done")
                            setAnnounce(localStorage.getItem('announcement'))
                        }}
                    />
                </div> : null}
                {filteredItems.length ? (
                    filteredItems.map((list) => (
                        <CommandPalette.List key={list.id} heading={list.heading}>
                            {list.items.map(({ id, ...rest }) => (
                                <CommandPalette.ListItem
                                    key={id}
                                    index={getItemIndex(filteredItems, id)}
                                    {...rest}
                                />
                            ))}
                        </CommandPalette.List>
                    ))
                ) : (
                    <h2
                        style={{
                            textAlign: 'center',
                            margin: '25px',
                            fontFamily: "var(--mono-font)",
                            color: 'var(--special-color)',
                        }}>
                        No Results
                    </h2>
                )}
            </CommandPalette.Page>
        </CommandPalette>
    )
}

export default Command;