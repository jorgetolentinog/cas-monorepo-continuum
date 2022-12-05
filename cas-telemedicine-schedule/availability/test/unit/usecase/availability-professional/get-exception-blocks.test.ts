import { dayjs } from "@package/dayjs-extended";
import { config } from "../../../../src/config";
import { getExcepcionBlocks } from "../../../../src/usecase/availability-professional/get-exception-blocks";

test("No debe devolver bloques de días no configurados", async () => {
  // Arrange
  const startDate = dayjs.tz("2022-08-01", config.timezone);
  const endDate = dayjs.tz("2022-08-07", config.timezone);

  // Act
  const blocks = getExcepcionBlocks({
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    recurrence: "weekly",
    repeatRecurrenceEvery: 1,
    days: [
      {
        dayOfWeek: 2,
        blocks: [{ startTime: "15:00:00", endTime: "15:30:00" }],
      },
      {
        dayOfWeek: 4,
        blocks: [{ startTime: "15:00:00", endTime: "15:30:00" }],
      },
      {
        dayOfWeek: 6,
        blocks: [{ startTime: "15:00:00", endTime: "15:30:00" }],
      },
    ],
  });

  // Act
  expect(blocks).toMatchObject([
    {
      startDate: "2022-08-02T15:00:00",
      endDate: "2022-08-02T15:30:00",
    },
    {
      startDate: "2022-08-04T15:00:00",
      endDate: "2022-08-04T15:30:00",
    },
    {
      startDate: "2022-08-06T15:00:00",
      endDate: "2022-08-06T15:30:00",
    },
  ]);
});

test("Deberia devolver un bloque el día jueves de cada semana de octubre", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-10-31", config.timezone);

  // Act
  const blocks = getExcepcionBlocks({
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    recurrence: "weekly",
    repeatRecurrenceEvery: 1,
    days: [
      {
        dayOfWeek: 4,
        blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
      },
    ],
  });

  expect(blocks).toMatchObject([
    {
      startDate: "2020-10-01T11:00:00",
      endDate: "2020-10-01T11:30:00",
    },
    {
      startDate: "2020-10-08T11:00:00",
      endDate: "2020-10-08T11:30:00",
    },
    {
      startDate: "2020-10-15T11:00:00",
      endDate: "2020-10-15T11:30:00",
    },
    {
      startDate: "2020-10-22T11:00:00",
      endDate: "2020-10-22T11:30:00",
    },
    {
      startDate: "2020-10-29T11:00:00",
      endDate: "2020-10-29T11:30:00",
    },
  ]);
});

test("Deberia devolver un bloque el día jueves cada dos semanas de octubre", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-10-31", config.timezone);

  // Act
  const blocks = getExcepcionBlocks({
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    recurrence: "weekly",
    repeatRecurrenceEvery: 2,
    days: [
      {
        dayOfWeek: 4,
        blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
      },
    ],
  });

  // Assert
  expect(blocks).toMatchObject([
    { startDate: "2020-10-01T11:00:00", endDate: "2020-10-01T11:30:00" },
    { startDate: "2020-10-15T11:00:00", endDate: "2020-10-15T11:30:00" },
    { startDate: "2020-10-29T11:00:00", endDate: "2020-10-29T11:30:00" },
  ]);
});

test("Deberia devolver un bloque el día 21 de octubre", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-10-31", config.timezone);

  // Act
  const blocks = getExcepcionBlocks({
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    recurrence: "monthly",
    repeatRecurrenceEvery: 1,
    dayOfMonth: 21,
    days: [
      {
        blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
      },
    ],
  });

  // Assert
  expect(blocks).toMatchObject([
    { startDate: "2020-10-21T11:00:00", endDate: "2020-10-21T11:30:00" },
  ]);
});

test("Deberia devolver un bloque el día 21 de cada mes desde octubre a diciembre", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-12-31", config.timezone);

  // Act
  const blocks = getExcepcionBlocks({
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    recurrence: "monthly",
    repeatRecurrenceEvery: 1,
    dayOfMonth: 21,
    days: [
      {
        blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
      },
    ],
  });

  // Assert
  expect(blocks).toMatchObject([
    {
      startDate: "2020-10-21T11:00:00",
      endDate: "2020-10-21T11:30:00",
    },
    {
      startDate: "2020-11-21T11:00:00",
      endDate: "2020-11-21T11:30:00",
    },
    {
      startDate: "2020-12-21T11:00:00",
      endDate: "2020-12-21T11:30:00",
    },
  ]);
});

test("Deberia devolver un bloque el día 21 cada dos meses desde octubre a diciembre", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-12-31", config.timezone);

  // Act
  const blocks = getExcepcionBlocks({
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    recurrence: "monthly",
    repeatRecurrenceEvery: 2,
    dayOfMonth: 21,
    days: [
      {
        blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
      },
    ],
  });

  // Assert
  expect(blocks).toMatchObject([
    { startDate: "2020-10-21T11:00:00", endDate: "2020-10-21T11:30:00" },
    { startDate: "2020-12-21T11:00:00", endDate: "2020-12-21T11:30:00" },
  ]);
});

test("Deberia devolver un bloque el día lunes de cada semana de octubre", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-10-31", config.timezone);

  // Act
  const blocks = getExcepcionBlocks({
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    recurrence: "monthly",
    repeatRecurrenceEvery: 1,
    dayOfWeek: 1,
    days: [
      {
        blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
      },
    ],
  });

  // Assert
  expect(blocks).toMatchObject([
    { startDate: "2020-10-05T11:00:00", endDate: "2020-10-05T11:30:00" },
    { startDate: "2020-10-12T11:00:00", endDate: "2020-10-12T11:30:00" },
    { startDate: "2020-10-19T11:00:00", endDate: "2020-10-19T11:30:00" },
    { startDate: "2020-10-26T11:00:00", endDate: "2020-10-26T11:30:00" },
  ]);
});

test("Deberia devolver un bloque el día lunes de cada semana de cada dos meses de octubre a diciembre", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-12-31", config.timezone);

  // Act
  const blocks = getExcepcionBlocks({
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    recurrence: "monthly",
    repeatRecurrenceEvery: 2,
    dayOfWeek: 1,
    days: [
      {
        blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
      },
    ],
  });

  // Assert
  expect(blocks).toMatchObject([
    { startDate: "2020-10-05T11:00:00", endDate: "2020-10-05T11:30:00" },
    { startDate: "2020-10-12T11:00:00", endDate: "2020-10-12T11:30:00" },
    { startDate: "2020-10-19T11:00:00", endDate: "2020-10-19T11:30:00" },
    { startDate: "2020-10-26T11:00:00", endDate: "2020-10-26T11:30:00" },
    { startDate: "2020-12-07T11:00:00", endDate: "2020-12-07T11:30:00" },
    { startDate: "2020-12-14T11:00:00", endDate: "2020-12-14T11:30:00" },
    { startDate: "2020-12-21T11:00:00", endDate: "2020-12-21T11:30:00" },
    { startDate: "2020-12-28T11:00:00", endDate: "2020-12-28T11:30:00" },
  ]);
});

test("Deberia devolver un bloque el día lunes de la segunda semana de octubre", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-10-31", config.timezone);

  // Act
  const blocks = getExcepcionBlocks({
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    recurrence: "monthly",
    repeatRecurrenceEvery: 2,
    dayOfWeek: 1,
    weekOfMonth: 2,
    days: [
      {
        blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
      },
    ],
  });

  // Assert
  expect(blocks).toMatchObject([
    { startDate: "2020-10-05T11:00:00", endDate: "2020-10-05T11:30:00" },
  ]);
});

test("Deberia devolver un bloque el día lunes de la segunda de cada mes desde octubre a diciembre", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-12-31", config.timezone);

  // Act
  const blocks = getExcepcionBlocks({
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    recurrence: "monthly",
    repeatRecurrenceEvery: 1,
    dayOfWeek: 1,
    weekOfMonth: 2,
    days: [
      {
        blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
      },
    ],
  });

  // Assert
  expect(blocks).toMatchObject([
    { startDate: "2020-10-05T11:00:00", endDate: "2020-10-05T11:30:00" },
    { startDate: "2020-11-02T11:00:00", endDate: "2020-11-02T11:30:00" },
    { startDate: "2020-12-07T11:00:00", endDate: "2020-12-07T11:30:00" },
  ]);
});

test("Deberia devolver un bloque el día lunes de la segunda semana del mes cada dos meses desde octubre a diciembre", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-12-31", config.timezone);

  // Act
  const blocks = getExcepcionBlocks({
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    recurrence: "monthly",
    repeatRecurrenceEvery: 2,
    dayOfWeek: 1,
    weekOfMonth: 2,
    days: [
      {
        blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
      },
    ],
  });

  // Assert
  expect(blocks).toMatchObject([
    { startDate: "2020-10-05T11:00:00", endDate: "2020-10-05T11:30:00" },
    { startDate: "2020-12-07T11:00:00", endDate: "2020-12-07T11:30:00" },
  ]);
});

test("Deberia lanzar error si a la recurrencia semanal recibe el criterio dia de mes", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-12-31", config.timezone);

  // Act
  const wrapper = () => {
    getExcepcionBlocks({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      recurrence: "weekly",
      repeatRecurrenceEvery: 1,
      dayOfMonth: 1,
      days: [
        {
          blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
        },
      ],
    });
  };

  // Assert
  expect(wrapper).toThrowError(/Week recurrence does not require specifying/i);
});

test("Deberia lanzar error si a la recurrencia semanal recibe el criterio semana del mes", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-12-31", config.timezone);

  // Act
  const wrapper = () => {
    getExcepcionBlocks({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      recurrence: "weekly",
      repeatRecurrenceEvery: 1,
      weekOfMonth: 1,
      days: [
        {
          blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
        },
      ],
    });
  };

  // Assert
  expect(wrapper).toThrowError(/Week recurrence does not require specifying/i);
});

test("Deberia lanzar error si a la recurrencia semanal recibe el criterio día de semana", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-12-31", config.timezone);

  // Act
  const wrapper = () => {
    getExcepcionBlocks({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      recurrence: "weekly",
      repeatRecurrenceEvery: 1,
      dayOfWeek: 1,
      days: [
        {
          blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
        },
      ],
    });
  };

  // Assert
  expect(wrapper).toThrowError(/Week recurrence does not require specifying/i);
});

test("Deberia lanzar error si a la recurrencia semanal no recibe dia de la semana en el bloque", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-12-31", config.timezone);

  // Act
  const wrapper = () => {
    getExcepcionBlocks({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      recurrence: "weekly",
      repeatRecurrenceEvery: 1,
      days: [
        {
          blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
        },
      ],
    });
  };

  // Assert
  expect(wrapper).toThrowError(
    /Day of week of the block is required when recurrence is weekly/i
  );
});

test("Deberia lanzar error si a la recurrencia mensual no recibe ningun criterio válido para el mes", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-12-31", config.timezone);

  // Act
  const wrapper = () => {
    getExcepcionBlocks({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      recurrence: "monthly",
      repeatRecurrenceEvery: 1,
      days: [
        {
          blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
        },
      ],
    });
  };

  // Assert
  expect(wrapper).toThrowError(/Monthly recurrence requires specifying/i);
});

test("Deberia lanzar error si a la recurrencia mensual recibe dia de la semana en el bloque", async () => {
  // Arrange
  const startDate = dayjs.tz("2020-10-01", config.timezone);
  const endDate = dayjs.tz("2020-12-31", config.timezone);

  // Act
  const wrapper = () => {
    getExcepcionBlocks({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      recurrence: "monthly",
      repeatRecurrenceEvery: 1,
      dayOfMonth: 1,
      days: [
        {
          dayOfWeek: 1,
          blocks: [{ startTime: "11:00:00", endTime: "11:30:00" }],
        },
      ],
    });
  };

  // Assert
  expect(wrapper).toThrowError(
    /Day of week of the block should be null when the recurrence is monthly/i
  );
});
