import { ConflictException } from '@nestjs/common';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoomEntity } from '../rooms/entities/room.entity';
import { ReservationEntity } from './entities/reservation.entity';
import { ReservationRulesService } from './reservation-rules.service';
import { ReservationsService } from './reservations.service';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationsRepositoryMock: {
    findOne: jest.Mock<() => Promise<ReservationEntity | null>>;
    find: jest.Mock;
    create: jest.Mock;
    save: jest.Mock<(reservation: ReservationEntity) => Promise<ReservationEntity>>;
  };
  let roomsRepositoryMock: { findOneBy: jest.Mock };
  let reservationRulesServiceMock: { ensureCanCancel: jest.Mock };

  beforeEach(async () => {
    reservationsRepositoryMock = {
      findOne: jest.fn<() => Promise<ReservationEntity | null>>(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn<() => Promise<ReservationEntity>>(),
    };
    roomsRepositoryMock = { findOneBy: jest.fn() };
    reservationRulesServiceMock = { ensureCanCancel: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: getRepositoryToken(ReservationEntity), useValue: reservationsRepositoryMock },
        { provide: getRepositoryToken(RoomEntity), useValue: roomsRepositoryMock },
        { provide: ReservationRulesService, useValue: reservationRulesServiceMock },
      ],
    }).compile();
    service = moduleRef.get(ReservationsService);
  });

  it('cancels an active reservation and returns the saved result', async () => {
    const reservation = {
      id: 7,
      purpose: 'Project planning',
      participants: 6,
      status: 'active',
      room: { id: 1, name: 'Room A' },
    } as ReservationEntity;
    const savedReservation = { ...reservation, status: 'cancelled' } as ReservationEntity;

    // TODO TEST 2: Arrange dependencies, call cancel(7), and check the required behavior.
    reservationsRepositoryMock.findOne.mockResolvedValue(reservation);
    reservationsRepositoryMock.save.mockResolvedValue(savedReservation);

    //act
    const result = await service.cancel(7);

    //assert
    expect(reservationRulesServiceMock.ensureCanCancel).toHaveBeenCalledWith(reservation);

    expect(reservationsRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 7,
        status: 'cancelled',
      }),
    );

  expect(result).toEqual(savedReservation);
  });

  it('does not change or save a reservation when the rule rejects cancellation', async () => {
    const reservation = {
      id: 9,
      purpose: 'Team review',
      participants: 4,
      status: 'active',
      room: { id: 2, name: 'Room B' },
    } as ReservationEntity;

    // TODO TEST 3: Make the mock rule reject this ACTIVE reservation, as requested.
    // Check the exception, the unchanged state, and the absence of a save() call.
    throw new Error('TODO TEST 3: complete the rejected cancellation test');
  });
});
