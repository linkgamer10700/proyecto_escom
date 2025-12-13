import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    try {
        console.log('🌱 Iniciando seed de la base de datos...\n');

        // 1. Crear roles
        console.log('📝 Creando roles...');
        const adminRole = await prisma.rol.upsert({
            where: { nombre: 'Admin' },
            update: {},
            create: {
                nombre: 'Admin',
                descripcion: 'Administrador del sistema'
            }
        });

        const userRole = await prisma.rol.upsert({
            where: { nombre: 'Usuario' },
            update: {},
            create: {
                nombre: 'Usuario',
                descripcion: 'Usuario regular del sistema'
            }
        });

        console.log(`✓ Roles creados: ${adminRole.nombre}, ${userRole.nombre}\n`);

        // 2. Crear departamento
        console.log('🏢 Creando departamento...');
        const departamento = await prisma.departamento.upsert({
            where: { nombre: 'Soporte Técnico' },
            update: {},
            create: {
                nombre: 'Soporte Técnico',
                descripcion: 'Departamento de soporte técnico y sistemas',
                activo: true
            }
        });

        console.log(`✓ Departamento creado: ${departamento.nombre}\n`);

        // 3. Crear categoría
        console.log('📁 Creando categoría...');
        const categoria = await prisma.categoria.upsert({
            where: { nombre: 'Soporte Técnico' },
            update: {},
            create: {
                nombre: 'Soporte Técnico',
                descripcion: 'Problemas técnicos y de software',
                color: '#3b82f6',
                activo: true
            }
        });

        console.log(`✓ Categoría creada: ${categoria.nombre}\n`);

        // 4. Crear usuario admin
        console.log('👨‍💼 Creando usuario administrador...');
        const adminPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.usuario.upsert({
            where: { correo: 'admin@escom.ipn.mx' },
            update: {},
            create: {
                correo: 'admin@escom.ipn.mx',
                contrasena: adminPassword,
                nombre: 'Admin Test',
                telefono: '5512345678',
                rolId: adminRole.id,
                departamentoId: departamento.id,
                activo: true,
                emailVerificado: true,
            }
        });

        console.log(`✓ Admin creado: ${admin.nombre} (${admin.correo})\n`);

        // 5. Crear usuario regular de prueba
        console.log('👤 Creando usuario de prueba...');
        const userPassword = await bcrypt.hash('prueba123', 10);

        const testUser = await prisma.usuario.upsert({
            where: { correo: 'usuario.prueba@escom.ipn.mx' },
            update: {},
            create: {
                correo: 'usuario.prueba@escom.ipn.mx',
                contrasena: userPassword,
                nombre: 'Usuario de Prueba',
                telefono: '5587654321',
                rolId: userRole.id,
                adminId: admin.id, // Vinculado al admin
                activo: true,
                emailVerificado: true,
            }
        });

        console.log(`✓ Usuario creado: ${testUser.nombre} (${testUser.correo})\n`);

        // 6. Crear algunos tickets de prueba
        console.log('🎫 Creando tickets de prueba...');

        const ticketsData = [
            {
                titulo: 'No puedo acceder al sistema',
                descripcion: 'Aparece error de credenciales inválidas aunque mi contraseña es correcta',
                prioridad: 'Alta',
                estado: 'Abierto'
            },
            {
                titulo: 'Solicito acceso a laboratorio',
                descripcion: 'Necesito acceso al laboratorio 3B para proyecto de análisis',
                prioridad: 'Media',
                estado: 'En Progreso'
            },
            {
                titulo: 'Consulta sobre calificaciones',
                descripcion: '¿Cómo puedo revisar mis calificaciones del parcial anterior?',
                prioridad: 'Baja',
                estado: 'Resuelto'
            }
        ];

        let ticketNumber = 1;
        for (const ticketData of ticketsData) {
            const numeroTicket = `TK-${String(ticketNumber).padStart(6, '0')}`;

            await prisma.ticket.create({
                data: {
                    numeroTicket,
                    titulo: ticketData.titulo,
                    descripcion: ticketData.descripcion,
                    prioridad: ticketData.prioridad,
                    estado: ticketData.estado,
                    categoriaId: categoria.id,
                    creadoPorId: testUser.id,
                    asignadoAId: admin.id,
                    departamentoId: departamento.id,
                    resueltoEn: ticketData.estado === 'Resuelto' ? new Date() : null,
                }
            });

            console.log(`  ✓ Ticket ${numeroTicket}: ${ticketData.titulo}`);
            ticketNumber++;
        }

        console.log('\n✅ ¡Seed completado exitosamente!\n');
        console.log('═'.repeat(60));
        console.log('\n🔐 CREDENCIALES DE ACCESO\n');
        console.log('👨‍💼 ADMINISTRADOR:');
        console.log('   Correo:     admin@escom.ipn.mx');
        console.log('   Contraseña: admin123');
        console.log('   Dashboard:  /admin/dashboard');
        console.log('   Usuarios:   /admin/usuarios');
        console.log('\n👤 USUARIO DE PRUEBA:');
        console.log('   Correo:     usuario.prueba@escom.ipn.mx');
        console.log('   Contraseña: prueba123');
        console.log('   Dashboard:  /user/dashboard');
        console.log('\n═'.repeat(60));
        console.log('\n📊 Resumen:');
        console.log(`   • ${ticketsData.length} tickets creados`);
        console.log(`   • Tickets vinculados: Usuario → Admin`);
        console.log(`   • 1 admin, 1 usuario regular`);
        console.log(`   • ${ticketsData.filter(t => t.estado === 'Abierto').length} tickets abiertos`);
        console.log(`   • ${ticketsData.filter(t => t.estado === 'En Progreso').length} tickets en progreso`);
        console.log(`   • ${ticketsData.filter(t => t.estado === 'Resuelto').length} tickets resueltos`);
        console.log('\n');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
