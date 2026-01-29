const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const DATA_FILE = path.join(__dirname, 'data', 'products.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Serve static site from project root (so your html/css/js are served)
app.use(express.static(path.join(__dirname)));

function readProducts(){
  try{
    const txt = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(txt || '[]');
  }catch(e){
    return [];
  }
}

function writeProducts(list){
  try{
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive:true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
    return true;
  }catch(e){
    console.error('writeProducts error', e);
    return false;
  }
}

// API: get products
app.get('/api/products', (req, res) => {
  res.json(readProducts());
});

// API: replace products array (admin can POST full array)
app.post('/api/products', (req, res) => {
  const body = req.body;
  if(!Array.isArray(body)) return res.status(400).json({ error: 'expected array' });
  const ok = writeProducts(body);
  if(ok){
    io.emit('products', body);
    return res.json({ ok:true });
  }
  res.status(500).json({ ok:false });
});

// API: add single product
app.post('/api/product', (req, res) => {
  const p = req.body;
  if(!p || !p.title) return res.status(400).json({ error: 'invalid product' });
  const list = readProducts();
  list.unshift(p);
  const ok = writeProducts(list);
  if(ok){ io.emit('products', list); return res.json({ ok:true, product: p }); }
  res.status(500).json({ ok:false });
});

io.on('connection', socket => {
  console.log('socket connected', socket.id);
  // send current products
  socket.emit('products', readProducts());

  socket.on('addProduct', product => {
    try{
      const list = readProducts();
      list.unshift(product);
      writeProducts(list);
      io.emit('products', list);
    }catch(e){ console.error(e); }
  });

  // Remove a product by title (first match)
  socket.on('removeProduct', identifier => {
    try{
      const list = readProducts();
      const idx = list.findIndex(p => p.title === identifier || p.title === (identifier && identifier.title));
      if(idx >= 0){
        list.splice(idx,1);
        writeProducts(list);
        io.emit('products', list);
      }
    }catch(e){ console.error(e); }
  });

  // Clear all products (admin)
  socket.on('clearProducts', ()=>{
    try{
      writeProducts([]);
      io.emit('products', []);
    }catch(e){ console.error(e); }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=> console.log(`Server listening ${PORT}`));
