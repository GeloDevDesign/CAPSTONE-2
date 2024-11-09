import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { authenticateToken } from './Utils/authMiddleware.js';


import registerRoute from './routes/registerUserRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js'
import inventoryDisposeRoutes from './routes/inventoryDisposeRoute.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import orderAPI from './routes/orderRoutes.js'
import returnRefund from './routes/returnRefundRoutes.js';
import rawMaterialRoutes from './routes/rawMaterialRoutes.js';
import purchaseOrder from './routes/POroutes.js';
import userAuth from './routes/userAuth.js'
import voidRoutes from './routes/voidTransaction.js'
import supplier from './routes/supplier.js'
import dispose from './routes/disposeRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = 3000;
const _dirname = path.resolve();




app.use(cors({
  origin: process.env.PORT_ORIGIN,
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

app.use('/inventoryImages', express.static(path.join(__dirname, 'inventoryImages')));
app.use('/inventoryAPI', inventoryRoutes);
app.use('/inventoryDispose', inventoryDisposeRoutes);
app.use('/deliveryRoutes', deliveryRoutes);
app.use('/orderAPI', orderAPI);
app.use('/returnRefund', returnRefund);
app.use('/registerRoute', registerRoute);
app.use('/rawItems',rawMaterialRoutes);
app.use('/purchaseOrder',purchaseOrder);
app.use('/auth',userAuth)
app.use('/transaction',voidRoutes)
app.use('/supplier',supplier)
app.use('/dipose',dispose)


if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(_dirname,"/frontend/dist")));

  app.get("*",(req,res) =>{
    res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
  })
}


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



// // API router for protected routes
// const apiRouter = express.Router();
// app.use('/api', apiRouter);

// // Apply authentication middleware to all routes in apiRouter
// apiRouter.use(authenticateToken);

// // Protected routes
// apiRouter.use('/inventory', inventoryRoutes);
// apiRouter.use('/inventoryDispose', inventoryDisposeRoutes);
// apiRouter.use('/delivery', deliveryRoutes);
// apiRouter.use('/order', orderAPI);
// apiRouter.use('/returnRefund', returnRefund);
// apiRouter.use('/rawItems', rawMaterialRoutes);
// apiRouter.use('/purchaseOrder', purchaseOrder);

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });