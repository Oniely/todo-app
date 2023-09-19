import { useEffect, useState, useCallback } from "react";
import { Todo } from "../App";

interface ListProp {
    task: Todo[];
    filter?: string;
}

export const List: React.FC<ListProp> = ({ task, filter }) => {
    const [listTask, setListTask] = useState<Todo[]>([]);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [filtered, setFiltered] = useState<string | undefined>(undefined);

    useEffect(() => {
        const storedData = localStorage.getItem("tasks");
        const parsedData: Todo[] = storedData ? JSON.parse(storedData) : [];
        setListTask(parsedData);
        setFiltered(filter);
    }, [task, filter]);

    const handleItemStatus = (id: string) => {
        const updatedTasks = listTask.map((task) => {
            if (task.id === id) {
                const updatedStatus =
                    task.status === "Completed" ? "Incomplete" : "Completed";

                return {
                    ...task,
                    status: updatedStatus,
                };
            }
            return task;
        });

        // Update the state
        setListTask(updatedTasks);

        // Update the status in localStorage
        const storedData = localStorage.getItem("tasks");
        if (storedData) {
            const parsedData: Todo[] = JSON.parse(storedData);
            const updatedData = parsedData.map((task) => {
                if (task.id === id) {
                    const updatedStatus =
                        task.status === "Completed"
                            ? "Incomplete"
                            : "Completed";

                    return {
                        ...task,
                        status: updatedStatus,
                    };
                }
                return task;
            });
            localStorage.setItem("tasks", JSON.stringify(updatedData));
        }
    };

    const removeTask = (id: string) => {
        setListTask((prevTasks) => prevTasks.filter((task) => task.id !== id));

        const storedData = localStorage.getItem("tasks");

        if (storedData) {
            const parsedData: Todo[] = JSON.parse(storedData);

            // Find the index of the task with the provided id in the parsed data
            const taskIndex = parsedData.findIndex((task) => task.id === id);

            if (taskIndex !== -1) {
                // Remove the task from the parsed data
                parsedData.splice(taskIndex, 1);

                // Update the stored data in localStorage
                localStorage.setItem("tasks", JSON.stringify(parsedData));
            }
        }
    };

    const handleEditTask = (id: string) => {
        setEditingItemId(id);
    };

    const handleEditTitleChange = (id: string, newTitle: string) => {
        setListTask((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          title: newTitle,
                      }
                    : task
            )
        );
    };

    const saveEditedTitle = (id: string) => {
        // Update the task title in localStorage
        const storedData = localStorage.getItem("tasks");
        if (storedData) {
            const parsedData: Todo[] = JSON.parse(storedData);
            const updatedData = parsedData.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          title:
                              listTask.find((item) => item.id === id)?.title ||
                              task.title,
                      }
                    : task
            );
            localStorage.setItem("tasks", JSON.stringify(updatedData));
        }

        setEditingItemId(null);
    };

    const inputFocus = useCallback((e: HTMLInputElement) => {
        if (e) {
            e.focus();
            e.select();
        }
    }, []);

    const filteredTask = listTask.filter((item) => {
        if (filtered === "All") {
            return true;
        } else {
            return item.status === filtered;
        }
    });
    
    return (
        <>
            <ul className="list-group d-flex justify-content-center gap-3">
                {filteredTask.length === 0 && (
                    <div className="text-center p-3">
                        <span className="fs-3" style={{ color: "gray" }}>
                            No Todo
                        </span>
                    </div>
                )}

                {filteredTask.map((item) => {
                    return (
                        <li
                            className="list-group-item d-flex justify-content-between bg-light"
                            style={{
                                border: "1px solid rgba(0,0,0,0.2)",
                                borderRadius: "3px",
                                paddingTop: "12px",
                                paddingBottom: "12px",
                                overflowWrap: "break-word",
                                wordBreak: "break-all",
                            }}
                            key={item.id}
                        >
                            {editingItemId === item.id ? ( // Render input field in editing mode
                                <div className="d-flex justify-content-center align-items-center">
                                    <input
                                        type="text"
                                        ref={inputFocus}
                                        style={{
                                            fontSize: "18px",
                                            borderBottom: "1px solid black",
                                            padding: "0 10px",
                                            width: "12rem",
                                        }}
                                        value={item.title}
                                        onChange={(e) =>
                                            handleEditTitleChange(
                                                item.id,
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                saveEditedTitle(item.id);
                                                e.currentTarget.blur();
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="d-flex justify-content-center align-items-center">
                                    <input
                                        type="checkbox"
                                        id={item.id}
                                        className="checkbox flex-shrink-0"
                                        checked={
                                            item.status === "Completed" && true
                                        }
                                        onChange={() => {
                                            handleItemStatus(item.id);
                                        }}
                                    />
                                    <label
                                        htmlFor={item.id}
                                        className={
                                            item.status === "Completed"
                                                ? "label completed-label"
                                                : "label"
                                        }
                                        style={{
                                            marginRight: "20px",
                                        }}
                                    >
                                        {item.title}
                                    </label>
                                </div>
                            )}
                            <div
                                className="d-flex justify-content-center align-items-center"
                                style={{ gap: "0.6rem" }}
                            >
                                <button
                                    className="btn btn-sm"
                                    id="delete"
                                    onClick={() => removeTask(item.id)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="1em"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                    </svg>
                                </button>
                                {editingItemId === item.id ? ( // Render "Save" button in editing mode
                                    <button
                                        className="btn btn-sm btn-success"
                                        id="save"
                                        onClick={() => saveEditedTitle(item.id)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="1em"
                                            viewBox="0 0 448 512"
                                        >
                                            Font Awesome Free 6.4.2 by
                                            @fontawesome -
                                            https://fontawesome.com License -
                                            https://fontawesome.com/license
                                            (Commercial License) Copyright 2023
                                            Fonticons, Inc.
                                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-sm btn-primary"
                                        id="edit"
                                        name="updateBtn"
                                        onClick={() => handleEditTask(item.id)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="1em"
                                            viewBox="0 0 512 512"
                                        >
                                            <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};
