import React, {useContext, useEffect, useState} from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
    DotFilledIcon,
    CheckIcon,
    ChevronRightIcon,
} from '@radix-ui/react-icons';
import './Filter.css';
import {AuthContext} from '../../context/AuthContext'

const Filter = ({ volunteers, handleFilter }) => {
    const { user } = useContext(AuthContext);
    const [from, setFrom] = useState('Your Tasks');
    const [show, setShow] = useState('In Progress');
    const [volunteersChecked, setVolunteersChecked] = useState([]);

    useEffect(() => {
        handleFilter({ currentUser: user.email, show, from, volunteersChecked });
    }, [ show, from, volunteersChecked, user.email]);

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                {/*Normal button element used as Radix dropdown library does not work well with components*/}
                <button className="filter-sort-button IconButton" aria-label="Customise options">
                    Filter
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5} style={{ zIndex: 10}}>
                    <DropdownMenu.Label className="DropdownMenuLabel">Show</DropdownMenu.Label>
                    <DropdownMenu.RadioGroup value={show} onValueChange={setShow}>
                        <DropdownMenu.RadioItem className="DropdownMenuRadioItem" value="All">
                            <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                                <DotFilledIcon />
                            </DropdownMenu.ItemIndicator>
                            All
                        </DropdownMenu.RadioItem>
                        <DropdownMenu.RadioItem className="DropdownMenuRadioItem" value="In Progress">
                            <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                                <DotFilledIcon />
                            </DropdownMenu.ItemIndicator>
                            In Progress
                        </DropdownMenu.RadioItem>
                        <DropdownMenu.RadioItem className="DropdownMenuRadioItem" value="Overdue">
                            <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                                <DotFilledIcon />
                            </DropdownMenu.ItemIndicator>
                            Overdue
                        </DropdownMenu.RadioItem>
                        <DropdownMenu.RadioItem className="DropdownMenuRadioItem" value="Completed">
                            <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                                <DotFilledIcon />
                            </DropdownMenu.ItemIndicator>
                            Completed
                        </DropdownMenu.RadioItem>
                    </DropdownMenu.RadioGroup>

                    <DropdownMenu.Separator className="DropdownMenuSeparator" />

                    <DropdownMenu.RadioGroup value={from} onValueChange={setFrom}>
                        <DropdownMenu.Label className="DropdownMenuLabel">From</DropdownMenu.Label>
                        <DropdownMenu.RadioItem className="DropdownMenuRadioItem" value="All Tasks">
                            <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                                <DotFilledIcon />
                            </DropdownMenu.ItemIndicator>
                            All Tasks
                        </DropdownMenu.RadioItem>
                        <DropdownMenu.RadioItem className="DropdownMenuRadioItem" value="Your Tasks">
                            <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                                <DotFilledIcon />
                            </DropdownMenu.ItemIndicator>
                            Your Tasks
                        </DropdownMenu.RadioItem>
                    </DropdownMenu.RadioGroup>

                    <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">
                            Volunteers
                            <div className="RightSlot">
                                <ChevronRightIcon />
                            </div>
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.SubContent
                                className="DropdownMenuSubContent"
                                sideOffset={2}
                                alignOffset={-5}
                            >
                                <DropdownMenu.CheckboxItem
                                    className="DropdownMenuCheckboxItem"
                                    checked={volunteersChecked.length === 0}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setVolunteersChecked([]);
                                        }
                                    }}
                                >
                                    Clear Selection
                                </DropdownMenu.CheckboxItem>
                                <DropdownMenu.Separator className="DropdownMenuSeparator" />
                                {volunteers.map((volunteer) => (
                                    <DropdownMenu.CheckboxItem
                                        key={volunteer.email}
                                        className="DropdownMenuCheckboxItem"
                                        checked={volunteersChecked.includes(volunteer.email)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setVolunteersChecked([...volunteersChecked, volunteer.email]);
                                                setFrom('')
                                            } else {
                                                setVolunteersChecked(
                                                    volunteersChecked.filter((email) => email !== volunteer.email)
                                                );
                                            }
                                        }}
                                    >
                                        <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                                            <CheckIcon />
                                        </DropdownMenu.ItemIndicator>
                                        {volunteer.fullName}
                                    </DropdownMenu.CheckboxItem>
                                    ))}
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Sub>


                    <DropdownMenu.Arrow className="DropdownMenuArrow" />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default Filter;
