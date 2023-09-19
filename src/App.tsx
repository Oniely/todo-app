import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { List } from "./components/List";
import { AddTodo } from "./components/AddTodo";
import { Credits } from "./components/Credits";
import { GlobalHotKeys } from "react-hotkeys";

export interface Todo {
    id: string;
    title: string;
    status: string;
}

const App: React.FC = () => {
    const [filter, setFilter] = useState("All");
    const [todo, setTodo] = useState<Todo[]>([]);
    const [onShow, setOnShow] = useState(false);

    const handleAddTodo = (newTodo: Todo) => {
        setTodo(prevTodos => [...prevTodos, newTodo])
        setOnShow(false);
    }

    function hideModal() {
        setOnShow(false);
    }

    // HotKeys Function
    function filterToAll() {
        setFilter("All");
    }
    function filterToIncomplete() {
        setFilter("Incomplete");
    }
    function filterToCompleted() {
        setFilter("Completed");
    }
    function showAddTask() {
        setOnShow(true);
    }

    return (
        <>
            <GlobalHotKeys
                keyMap={{
                    FILTER_TO_ALL: "ctrl+alt+a",
                    FILTER_TO_INCOMPLETE: "ctrl+alt+i",
                    FILTER_TO_COMPLETED: "ctrl+alt+c",
                    ADD_TASK: 'alt+a'
                }}
                handlers={{
                    FILTER_TO_ALL: filterToAll,
                    FILTER_TO_INCOMPLETE: filterToIncomplete,
                    FILTER_TO_COMPLETED: filterToCompleted,
                    ADD_TASK: showAddTask,
                }}
                allowChanges={true}
            >
                <Container
                    className="mt-4 pb-4"
                    style={{
                        maxWidth: "50rem",
                        minWidth: "fit-content",
                    }}
                >
                    <h1
                        className="text-center mb-4"
                        style={{
                            fontSize: "40px",
                            fontWeight: "700",
                            color: "#646681",
                        }}
                    >
                        TODO LIST
                    </h1>
                    <div className="d-flex justify-content-between align-items-center py-2">
                        <AddTodo onAddTodo={handleAddTodo} onShow={onShow} handleModal={hideModal}/>
                        <select
                            className="btn text-start py-2"
                            name="dropbtn"
                            id="dropbtn"
                            value={filter}
                            style={{
                                backgroundColor: "#dedede",
                                color: "#585858",
                            }}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Incomplete">Incomplete</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div
                        className="p-3"
                        id="list-container"
                        style={{
                            borderRadius: "8px",
                            backgroundColor: "#dedede",
                        }}
                    >
                        <List task={todo} filter={filter} />
                    </div>
                </Container>
                <Credits />
            </GlobalHotKeys>
        </>
    );
};

export default App;
