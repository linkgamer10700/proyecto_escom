-- Create Database
CREATE DATABASE IF NOT EXISTS proyecto_escom_db;
USE proyecto_escom_db;

-- 1. Create Rol Table
CREATE TABLE IF NOT EXISTS `Rol` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `Rol_nombre_key`(`nombre`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Create Departamento Table (Circular dependency with Usuario handled later if specific FK constraint needed, but standard create works if table exists? No, need table to exist for FK. I will create table first without FK then add constraint, or just create tables then constraints.)
-- For simplicity, I'll create tables then alter for FKs or just order safely where possible. FKs usually require the referenced table to exist.
-- I'll create all tables first then add Foreign Keys to handle circular dependencies safely.

CREATE TABLE IF NOT EXISTS `Departamento` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(255) NOT NULL,
    `descripcion` TEXT,
    `managerId` VARCHAR(191),
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `Departamento_nombre_key`(`nombre`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Create Usuario Table
CREATE TABLE IF NOT EXISTS `Usuario` (
    `id` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(255) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    `nombre` VARCHAR(255) NOT NULL,
    `rolId` VARCHAR(191) NOT NULL,
    `departamentoId` VARCHAR(191),
    `avatar` VARCHAR(255),
    `telefono` VARCHAR(50),
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `emailVerificado` BOOLEAN NOT NULL DEFAULT false,
    `ultimoIngreso` DATETIME(3),
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `Usuario_correo_key`(`correo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Create NextAuth Tables (Account, Session, User, VerificationToken)
-- Note: 'User' is for NextAuth, 'Usuario' is the custom app user.
CREATE TABLE IF NOT EXISTS `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `email` VARCHAR(191),
    `emailVerified` DATETIME(3),
    `image` VARCHAR(191),
    PRIMARY KEY (`id`),
    UNIQUE INDEX `User_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT,
    `access_token` TEXT,
    `expires_at` INT,
    `token_type` VARCHAR(191),
    `scope` VARCHAR(191),
    `id_token` TEXT,
    `session_state` VARCHAR(191),
    PRIMARY KEY (`id`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 5. Create Categoria
CREATE TABLE IF NOT EXISTS `Categoria` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(255) NOT NULL,
    `descripcion` TEXT,
    `color` VARCHAR(7),
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `Categoria_nombre_key`(`nombre`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6. Create PoliticaSLA
CREATE TABLE IF NOT EXISTS `PoliticaSLA` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(255) NOT NULL,
    `prioridad` VARCHAR(191) NOT NULL,
    `tiempoRespuesta` INT NOT NULL,
    `tiempoResolucion` INT NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 7. Create Etiqueta
CREATE TABLE IF NOT EXISTS `Etiqueta` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `color` VARCHAR(7),
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE INDEX `Etiqueta_nombre_key`(`nombre`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 8. Create PlantillaRespuesta
CREATE TABLE IF NOT EXISTS `PlantillaRespuesta` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `contenido` TEXT NOT NULL,
    `categoriaId` VARCHAR(191),
    `creadoPorId` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 9. Create Ticket
CREATE TABLE IF NOT EXISTS `Ticket` (
    `id` VARCHAR(191) NOT NULL,
    `numeroTicket` VARCHAR(50) NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `prioridad` VARCHAR(191) NOT NULL,
    `fechaLimite` DATETIME(3),
    `resueltoEn` DATETIME(3),
    `cerradoEn` DATETIME(3),
    `calificacion` INT,
    `comentarioCalificacion` TEXT,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,
    `categoriaId` VARCHAR(191),
    `creadoPorId` VARCHAR(191) NOT NULL,
    `asignadoAId` VARCHAR(191),
    `departamentoId` VARCHAR(191),
    `politicaSlaId` VARCHAR(191),
    PRIMARY KEY (`id`),
    UNIQUE INDEX `Ticket_numeroTicket_key`(`numeroTicket`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 10. Create Comentario
CREATE TABLE IF NOT EXISTS `Comentario` (
    `id` VARCHAR(191) NOT NULL,
    `contenido` TEXT NOT NULL,
    `esInterno` BOOLEAN NOT NULL DEFAULT false,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,
    `ticketId` VARCHAR(191),
    `usuarioId` VARCHAR(191),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 11. Create ArchivoAdjunto
CREATE TABLE IF NOT EXISTS `ArchivoAdjunto` (
    `id` VARCHAR(191) NOT NULL,
    `nombreArchivo` VARCHAR(255) NOT NULL,
    `urlArchivo` VARCHAR(500) NOT NULL,
    `tamanoArchivo` INT NOT NULL,
    `tipoMime` VARCHAR(100),
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ticketId` VARCHAR(191),
    `comentarioId` VARCHAR(191),
    `usuarioId` VARCHAR(191),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 12. Create HistorialTicket
CREATE TABLE IF NOT EXISTS `HistorialTicket` (
    `id` VARCHAR(191) NOT NULL,
    `campo` VARCHAR(100) NOT NULL,
    `valorAnterior` TEXT,
    `valorNuevo` TEXT,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ticketId` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 13. Create Notificacion
CREATE TABLE IF NOT EXISTS `Notificacion` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(100) NOT NULL,
    `mensaje` TEXT NOT NULL,
    `leida` BOOLEAN NOT NULL DEFAULT false,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` VARCHAR(191) NOT NULL,
    `ticketId` VARCHAR(191),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 14. Create TicketEtiqueta
CREATE TABLE IF NOT EXISTS `TicketEtiqueta` (
    `ticketId` VARCHAR(191) NOT NULL,
    `etiquetaId` VARCHAR(191) NOT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`ticketId`, `etiquetaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- Add Foreign Keys
-- Usuario -> Rol
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `Rol`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
-- Usuario -> Departamento
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_departamentoId_fkey` FOREIGN KEY (`departamentoId`) REFERENCES `Departamento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Departamento -> Usuario (Manager)
ALTER TABLE `Departamento` ADD CONSTRAINT `Departamento_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- NextAuth Keys
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- PlantillaRespuesta
ALTER TABLE `PlantillaRespuesta` ADD CONSTRAINT `PlantillaRespuesta_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `PlantillaRespuesta` ADD CONSTRAINT `PlantillaRespuesta_creadoPorId_fkey` FOREIGN KEY (`creadoPorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Ticket
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_creadoPorId_fkey` FOREIGN KEY (`creadoPorId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_asignadoAId_fkey` FOREIGN KEY (`asignadoAId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_departamentoId_fkey` FOREIGN KEY (`departamentoId`) REFERENCES `Departamento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_politicaSlaId_fkey` FOREIGN KEY (`politicaSlaId`) REFERENCES `PoliticaSLA`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Comentario
ALTER TABLE `Comentario` ADD CONSTRAINT `Comentario_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Comentario` ADD CONSTRAINT `Comentario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ArchivoAdjunto
ALTER TABLE `ArchivoAdjunto` ADD CONSTRAINT `ArchivoAdjunto_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `ArchivoAdjunto` ADD CONSTRAINT `ArchivoAdjunto_comentarioId_fkey` FOREIGN KEY (`comentarioId`) REFERENCES `Comentario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `ArchivoAdjunto` ADD CONSTRAINT `ArchivoAdjunto_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- HistorialTicket
ALTER TABLE `HistorialTicket` ADD CONSTRAINT `HistorialTicket_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `HistorialTicket` ADD CONSTRAINT `HistorialTicket_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Notificacion
ALTER TABLE `Notificacion` ADD CONSTRAINT `Notificacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Notificacion` ADD CONSTRAINT `Notificacion_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- TicketEtiqueta
ALTER TABLE `TicketEtiqueta` ADD CONSTRAINT `TicketEtiqueta_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `TicketEtiqueta` ADD CONSTRAINT `TicketEtiqueta_etiquetaId_fkey` FOREIGN KEY (`etiquetaId`) REFERENCES `Etiqueta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
