import axios from "axios";
import { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Box,
  Input,
  Center,
  Select,
  FormControl,
  FormLabel,
  VStack,
  HStack,
} from "@chakra-ui/react";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/tasks");
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    try {
      await axios.post(
        `http://localhost:8000/tasks?title=${newTitle}&description=${newDescription}`
      );
      setNewTitle("");
      setNewDescription("");
      fetchTasks();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const editTask = (task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status);
  };

  const updateTask = async (id) => {
    try {
      await axios.put(
        `http://localhost:8000/tasks/${id}?title=${editTitle}&description=${editDescription}&status=${editStatus}`
      );
      setEditTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const cancelEdit = () => {
    setEditTaskId(null);
  };

  console.log(tasks);

  return (
    <Center>
      <VStack spacing={4} width="100%" maxW="1000px" overflowX="auto">
        <Box width="100%" maxW="1000px">
          <FormControl>
            <FormLabel>new task</FormLabel>
            <HStack>
              <Input
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Input
                placeholder="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              <Button colorScheme="pink" onClick={createTask}>
                add
              </Button>
            </HStack>
          </FormControl>
        </Box>
        <TableContainer width="100%" maxW="1000px">
          <Table variant="striped" colorScheme="pink">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map((task) => (
                <Tr key={task.id}>
                  {editTaskId === task.id ? (
                    <>
                      <Td>
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      </Td>
                      <Td>
                        <Input
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                      </Td>
                      <Td>
                        <Select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                        >
                          <option value="to do">to do</option>
                          <option value="done">done</option>
                        </Select>
                      </Td>
                      <Td>
                        <Button
                          colorScheme="blue"
                          onClick={() => updateTask(task.id)}
                        >
                          Save
                        </Button>
                        <Button colorScheme="gray" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </Td>
                    </>
                  ) : (
                    <>
                      <Td>{task.title}</Td>
                      <Td>{task.description}</Td>
                      <Td>{task.status}</Td>
                      <Td>
                        <Button
                          mr="1"
                          colorScheme="gray"
                          onClick={() => editTask(task)}
                        >
                          edit
                        </Button>
                        <Button
                          colorScheme="gray"
                          onClick={() => deleteTask(task.id)}
                        >
                          delete
                        </Button>
                      </Td>
                    </>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Center>
  );
};

export default TaskList;
