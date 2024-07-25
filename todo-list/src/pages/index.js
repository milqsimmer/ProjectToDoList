import { useEffect, useState } from "react";
import axios from "axios";
import TaskList from "../components/TaskList";
import { Box, Container, Heading } from "@chakra-ui/react";

const Home = () => {
  const [tasks, setTasks] = useState([]);

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

  return (
    <Container maxW="container.xl" mt={8}>
      <Heading as="h1" mb={4} textAlign="center">
        My To Do List
      </Heading>
      <Box mt={8}>
        <TaskList tasks={tasks} fetchTasks={fetchTasks} />
      </Box>
    </Container>
  );
};

export default Home;
