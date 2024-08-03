import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { EmployeeModule } from './employee/employee.module';
import { PositionModule } from './position/position.module';
import { AllowanceModule } from './allowance/allowance.module';
import { Position } from './position/entities/position.entity';
import { Employee } from './employee/entities/employee.entity';
import { Allowance } from './allowance/entities/allowance.entity';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_DATABASE'),
        entities: [User, Role, Position, Employee, Allowance],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([
      UserModule,
      RoleModule,
      EmployeeModule,
      PositionModule,
      AllowanceModule,
    ]),
    UserModule,
    RoleModule,
    EmployeeModule,
    PositionModule,
    AllowanceModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
