import React from 'react';
import './Tasks.css'
// Components
import Footer from "../../components/Footer/Footer";
import Navigation from "../../components/Navigation/Navigation";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
// Icons
import User from "../../assets/icons/user.svg"
import Label from "../../assets/icons/tag-simple.svg"
import Checklist from "../../assets/icons/check-square.svg"
import Attachment from "../../assets/icons/paperclip.svg"
import Comment from "../../assets/icons/chat-centered-text.svg"
import Bookmark from "../../assets/icons/bookmark.svg"
import Duplicate from "../../assets/icons/copy.svg"
import Share from "../../assets/icons/share-network.svg"
import Delete from "../../assets/icons/file-x.svg"
import Archive from "../../assets/icons/archive-box.svg"

function NewTask(props) {
    return (
        <>
            <div className="outer-container">
                <div className="outer-content-container">
                    <Navigation/>
                    <div className="inner-content-container">
                        <Header
                            pageTitle="New Task"
                            backButton={true}
                        ></Header>

                        <main className="main-container-task">
                            <div className="task-content">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto asperiores at autem deserunt eligendi est eveniet fuga id iure maxime nesciunt numquam placeat possimus provident quaerat similique temporibus ullam ut vel veniam vero, voluptatibus! Accusamus consequuntur earum fugiat inventore iste laudantium nobis numquam quia ut voluptates! Aliquid aperiam dolorum eaque explicabo labore laborum molestiae molestias, obcaecati perspiciatis quos rem rerum, soluta temporibus veniam vero voluptatem, voluptatibus. Dolores et id recusandae. Alias aliquid dignissimos dolor eaque eos laudantium magnam molestias quas repudiandae rerum. Animi deleniti ducimus nam odio. Adipisci cumque exercitationem fugit molestiae neque quas repellendus unde veritatis. A assumenda at beatae commodi cupiditate deleniti dolorem dolores doloribus earum eligendi est eum explicabo hic id iste iure maiores, molestiae nemo non obcaecati odit, officiis possimus quae quas quidem, ratione repudiandae similique sint sit voluptate. Accusamus aliquam amet aperiam consequatur cumque delectus doloremque et ex excepturi, expedita facere harum impedit in incidunt ipsam iusto labore laboriosam modi nam neque nesciunt non obcaecati pariatur placeat quaerat quo quos sapiente sequi sit tempora tempore tenetur unde velit veniam, voluptate voluptatibus voluptatum? Blanditiis quod sequi soluta ut? Accusantium aliquid amet corporis molestias odio quasi repudiandae! Ab accusantium amet animi vera.</p>
                            </div>
                            <div className="task-menu">
                                <div className="top-task-menu">
                                    <p className="task-menu-header">Add to task</p>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Volunteers"
                                        icon={User}
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Labels"
                                        icon={Label}
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Checklist"
                                        icon={Checklist}
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Attachments"
                                        icon={Attachment}
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Comments"
                                        icon={Comment}
                                    ></Button>
                                </div>
                                <div className="bottom-task-menu">
                                    <p className="task-menu-header">Actions</p>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Boomark"
                                        icon={Bookmark}
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Duplicate"
                                        icon={Duplicate}
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Share"
                                        icon={Share}
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Delete"
                                        icon={Delete}
                                    ></Button>
                                    <Button
                                        className="event-task-menu-button"
                                        buttonText="Archive"
                                        icon={Archive}
                                    ></Button>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    );
}

export default NewTask;