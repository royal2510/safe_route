process.env.NODE_ENV='test'; process.env.JWT_SECRET='test-secret';
const request=require('supertest'); const app=require('../server');
describe('Safe Route AI API',()=>{
 test('GET /health returns app status',async()=>{const response=await request(app).get('/health'); expect(response.statusCode).toBe(200); expect(response.body.status).toBe('UP'); expect(response.body.service).toBe('Safe Route AI')});
 test('POST /api/routes without JWT is blocked',async()=>{const response=await request(app).post('/api/routes').send({startLocation:'A',endLocation:'B',estimatedTime:20}); expect(response.statusCode).toBe(401)});
 test('Unknown endpoint returns 404',async()=>{const response=await request(app).get('/not-found'); expect(response.statusCode).toBe(404)});
});
