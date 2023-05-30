require('dotenv').config();
const express = require('express');
const app = express();
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
// Enable CORS
app.use(cors());

// Create a Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to parse request body as JSON
app.use(express.json());
app.get('/produtos', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Produtos').select('*');
    if (error) {
      throw new Error(error.message);
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define a route to create a new entry in the "Produto" table
app.post('/produtos', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Produtos').insert(req.body);
    if (error) {
      throw new Error(error.message);
    }
    // Send the inserted data as a response
    res.status(201).json({ message: 'Create successful', data});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define a route to update an existing entry in the "Produto" table
app.put('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('Produtos')
      .update(req.body)
      .match({ id });

    if (error) {
      throw new Error(error.message);
    }
    // Send the updated data as a response
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define a route to delete an entry from the "Produto" table
app.delete('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('Produtos')
      .delete()
      .match({ id });

    if (error) {
      throw new Error(error.message);
    }
    // Send a success message as a response
    res.json({ message: 'Delete successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
