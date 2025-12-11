
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Order
 * 
 */
export type Order = $Result.DefaultSelection<Prisma.$OrderPayload>
/**
 * Model ChatSession
 * 
 */
export type ChatSession = $Result.DefaultSelection<Prisma.$ChatSessionPayload>
/**
 * Model Ticket
 * 
 */
export type Ticket = $Result.DefaultSelection<Prisma.$TicketPayload>
/**
 * Model ConversationMessage
 * 
 */
export type ConversationMessage = $Result.DefaultSelection<Prisma.$ConversationMessagePayload>
/**
 * Model AgentAssignment
 * 
 */
export type AgentAssignment = $Result.DefaultSelection<Prisma.$AgentAssignmentPayload>
/**
 * Model HandoffRequest
 * 
 */
export type HandoffRequest = $Result.DefaultSelection<Prisma.$HandoffRequestPayload>
/**
 * Model ScrapeJob
 * 
 */
export type ScrapeJob = $Result.DefaultSelection<Prisma.$ScrapeJobPayload>
/**
 * Model AgentAccount
 * 
 */
export type AgentAccount = $Result.DefaultSelection<Prisma.$AgentAccountPayload>
/**
 * Model LoginToken
 * 
 */
export type LoginToken = $Result.DefaultSelection<Prisma.$LoginTokenPayload>
/**
 * Model LoginAudit
 * 
 */
export type LoginAudit = $Result.DefaultSelection<Prisma.$LoginAuditPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ScrapeJobStatus: {
  queued: 'queued',
  running: 'running',
  completed: 'completed',
  failed: 'failed',
  canceled: 'canceled'
};

export type ScrapeJobStatus = (typeof ScrapeJobStatus)[keyof typeof ScrapeJobStatus]


export const ScrapeJobCadence: {
  manual: 'manual',
  daily: 'daily',
  weekly: 'weekly',
  monthly: 'monthly'
};

export type ScrapeJobCadence = (typeof ScrapeJobCadence)[keyof typeof ScrapeJobCadence]


export const AgentRole: {
  admin: 'admin',
  agent: 'agent'
};

export type AgentRole = (typeof AgentRole)[keyof typeof AgentRole]


export const LoginAuditStatus: {
  token_sent: 'token_sent',
  verified: 'verified',
  failure: 'failure',
  success: 'success'
};

export type LoginAuditStatus = (typeof LoginAuditStatus)[keyof typeof LoginAuditStatus]


export const AgentAvailability: {
  online: 'online',
  busy: 'busy',
  offline: 'offline'
};

export type AgentAvailability = (typeof AgentAvailability)[keyof typeof AgentAvailability]


export const HandoffRequestStatus: {
  pending: 'pending',
  awaiting_confirmation: 'awaiting_confirmation',
  assigned: 'assigned',
  expired: 'expired'
};

export type HandoffRequestStatus = (typeof HandoffRequestStatus)[keyof typeof HandoffRequestStatus]

}

export type ScrapeJobStatus = $Enums.ScrapeJobStatus

export const ScrapeJobStatus: typeof $Enums.ScrapeJobStatus

export type ScrapeJobCadence = $Enums.ScrapeJobCadence

export const ScrapeJobCadence: typeof $Enums.ScrapeJobCadence

export type AgentRole = $Enums.AgentRole

export const AgentRole: typeof $Enums.AgentRole

export type LoginAuditStatus = $Enums.LoginAuditStatus

export const LoginAuditStatus: typeof $Enums.LoginAuditStatus

export type AgentAvailability = $Enums.AgentAvailability

export const AgentAvailability: typeof $Enums.AgentAvailability

export type HandoffRequestStatus = $Enums.HandoffRequestStatus

export const HandoffRequestStatus: typeof $Enums.HandoffRequestStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.order`: Exposes CRUD operations for the **Order** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Orders
    * const orders = await prisma.order.findMany()
    * ```
    */
  get order(): Prisma.OrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatSession`: Exposes CRUD operations for the **ChatSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatSessions
    * const chatSessions = await prisma.chatSession.findMany()
    * ```
    */
  get chatSession(): Prisma.ChatSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ticket`: Exposes CRUD operations for the **Ticket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tickets
    * const tickets = await prisma.ticket.findMany()
    * ```
    */
  get ticket(): Prisma.TicketDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.conversationMessage`: Exposes CRUD operations for the **ConversationMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConversationMessages
    * const conversationMessages = await prisma.conversationMessage.findMany()
    * ```
    */
  get conversationMessage(): Prisma.ConversationMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentAssignment`: Exposes CRUD operations for the **AgentAssignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentAssignments
    * const agentAssignments = await prisma.agentAssignment.findMany()
    * ```
    */
  get agentAssignment(): Prisma.AgentAssignmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.handoffRequest`: Exposes CRUD operations for the **HandoffRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HandoffRequests
    * const handoffRequests = await prisma.handoffRequest.findMany()
    * ```
    */
  get handoffRequest(): Prisma.HandoffRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.scrapeJob`: Exposes CRUD operations for the **ScrapeJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScrapeJobs
    * const scrapeJobs = await prisma.scrapeJob.findMany()
    * ```
    */
  get scrapeJob(): Prisma.ScrapeJobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentAccount`: Exposes CRUD operations for the **AgentAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentAccounts
    * const agentAccounts = await prisma.agentAccount.findMany()
    * ```
    */
  get agentAccount(): Prisma.AgentAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loginToken`: Exposes CRUD operations for the **LoginToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoginTokens
    * const loginTokens = await prisma.loginToken.findMany()
    * ```
    */
  get loginToken(): Prisma.LoginTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loginAudit`: Exposes CRUD operations for the **LoginAudit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoginAudits
    * const loginAudits = await prisma.loginAudit.findMany()
    * ```
    */
  get loginAudit(): Prisma.LoginAuditDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.0
   * Query Engine version: 2ba551f319ab1df4bc874a89965d8b3641056773
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Order: 'Order',
    ChatSession: 'ChatSession',
    Ticket: 'Ticket',
    ConversationMessage: 'ConversationMessage',
    AgentAssignment: 'AgentAssignment',
    HandoffRequest: 'HandoffRequest',
    ScrapeJob: 'ScrapeJob',
    AgentAccount: 'AgentAccount',
    LoginToken: 'LoginToken',
    LoginAudit: 'LoginAudit'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "order" | "chatSession" | "ticket" | "conversationMessage" | "agentAssignment" | "handoffRequest" | "scrapeJob" | "agentAccount" | "loginToken" | "loginAudit"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Order: {
        payload: Prisma.$OrderPayload<ExtArgs>
        fields: Prisma.OrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findFirst: {
            args: Prisma.OrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          findMany: {
            args: Prisma.OrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          create: {
            args: Prisma.OrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          createMany: {
            args: Prisma.OrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          delete: {
            args: Prisma.OrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          update: {
            args: Prisma.OrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          deleteMany: {
            args: Prisma.OrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[]
          }
          upsert: {
            args: Prisma.OrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>
          }
          aggregate: {
            args: Prisma.OrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrder>
          }
          groupBy: {
            args: Prisma.OrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderCountArgs<ExtArgs>
            result: $Utils.Optional<OrderCountAggregateOutputType> | number
          }
        }
      }
      ChatSession: {
        payload: Prisma.$ChatSessionPayload<ExtArgs>
        fields: Prisma.ChatSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          findFirst: {
            args: Prisma.ChatSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          findMany: {
            args: Prisma.ChatSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          create: {
            args: Prisma.ChatSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          createMany: {
            args: Prisma.ChatSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          delete: {
            args: Prisma.ChatSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          update: {
            args: Prisma.ChatSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          deleteMany: {
            args: Prisma.ChatSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          upsert: {
            args: Prisma.ChatSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          aggregate: {
            args: Prisma.ChatSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatSession>
          }
          groupBy: {
            args: Prisma.ChatSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatSessionCountArgs<ExtArgs>
            result: $Utils.Optional<ChatSessionCountAggregateOutputType> | number
          }
        }
      }
      Ticket: {
        payload: Prisma.$TicketPayload<ExtArgs>
        fields: Prisma.TicketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TicketFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TicketFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          findFirst: {
            args: Prisma.TicketFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TicketFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          findMany: {
            args: Prisma.TicketFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          create: {
            args: Prisma.TicketCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          createMany: {
            args: Prisma.TicketCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TicketCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          delete: {
            args: Prisma.TicketDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          update: {
            args: Prisma.TicketUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          deleteMany: {
            args: Prisma.TicketDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TicketUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TicketUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          upsert: {
            args: Prisma.TicketUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          aggregate: {
            args: Prisma.TicketAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTicket>
          }
          groupBy: {
            args: Prisma.TicketGroupByArgs<ExtArgs>
            result: $Utils.Optional<TicketGroupByOutputType>[]
          }
          count: {
            args: Prisma.TicketCountArgs<ExtArgs>
            result: $Utils.Optional<TicketCountAggregateOutputType> | number
          }
        }
      }
      ConversationMessage: {
        payload: Prisma.$ConversationMessagePayload<ExtArgs>
        fields: Prisma.ConversationMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConversationMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConversationMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          findFirst: {
            args: Prisma.ConversationMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConversationMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          findMany: {
            args: Prisma.ConversationMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>[]
          }
          create: {
            args: Prisma.ConversationMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          createMany: {
            args: Prisma.ConversationMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConversationMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>[]
          }
          delete: {
            args: Prisma.ConversationMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          update: {
            args: Prisma.ConversationMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          deleteMany: {
            args: Prisma.ConversationMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConversationMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConversationMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>[]
          }
          upsert: {
            args: Prisma.ConversationMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          aggregate: {
            args: Prisma.ConversationMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConversationMessage>
          }
          groupBy: {
            args: Prisma.ConversationMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConversationMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConversationMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ConversationMessageCountAggregateOutputType> | number
          }
        }
      }
      AgentAssignment: {
        payload: Prisma.$AgentAssignmentPayload<ExtArgs>
        fields: Prisma.AgentAssignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentAssignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAssignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentAssignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAssignmentPayload>
          }
          findFirst: {
            args: Prisma.AgentAssignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAssignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentAssignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAssignmentPayload>
          }
          findMany: {
            args: Prisma.AgentAssignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAssignmentPayload>[]
          }
          create: {
            args: Prisma.AgentAssignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAssignmentPayload>
          }
          createMany: {
            args: Prisma.AgentAssignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentAssignmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAssignmentPayload>[]
          }
          delete: {
            args: Prisma.AgentAssignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAssignmentPayload>
          }
          update: {
            args: Prisma.AgentAssignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAssignmentPayload>
          }
          deleteMany: {
            args: Prisma.AgentAssignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentAssignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentAssignmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAssignmentPayload>[]
          }
          upsert: {
            args: Prisma.AgentAssignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAssignmentPayload>
          }
          aggregate: {
            args: Prisma.AgentAssignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentAssignment>
          }
          groupBy: {
            args: Prisma.AgentAssignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentAssignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentAssignmentCountArgs<ExtArgs>
            result: $Utils.Optional<AgentAssignmentCountAggregateOutputType> | number
          }
        }
      }
      HandoffRequest: {
        payload: Prisma.$HandoffRequestPayload<ExtArgs>
        fields: Prisma.HandoffRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HandoffRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HandoffRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HandoffRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HandoffRequestPayload>
          }
          findFirst: {
            args: Prisma.HandoffRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HandoffRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HandoffRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HandoffRequestPayload>
          }
          findMany: {
            args: Prisma.HandoffRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HandoffRequestPayload>[]
          }
          create: {
            args: Prisma.HandoffRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HandoffRequestPayload>
          }
          createMany: {
            args: Prisma.HandoffRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HandoffRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HandoffRequestPayload>[]
          }
          delete: {
            args: Prisma.HandoffRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HandoffRequestPayload>
          }
          update: {
            args: Prisma.HandoffRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HandoffRequestPayload>
          }
          deleteMany: {
            args: Prisma.HandoffRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HandoffRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HandoffRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HandoffRequestPayload>[]
          }
          upsert: {
            args: Prisma.HandoffRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HandoffRequestPayload>
          }
          aggregate: {
            args: Prisma.HandoffRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHandoffRequest>
          }
          groupBy: {
            args: Prisma.HandoffRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<HandoffRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.HandoffRequestCountArgs<ExtArgs>
            result: $Utils.Optional<HandoffRequestCountAggregateOutputType> | number
          }
        }
      }
      ScrapeJob: {
        payload: Prisma.$ScrapeJobPayload<ExtArgs>
        fields: Prisma.ScrapeJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScrapeJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScrapeJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeJobPayload>
          }
          findFirst: {
            args: Prisma.ScrapeJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScrapeJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeJobPayload>
          }
          findMany: {
            args: Prisma.ScrapeJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeJobPayload>[]
          }
          create: {
            args: Prisma.ScrapeJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeJobPayload>
          }
          createMany: {
            args: Prisma.ScrapeJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScrapeJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeJobPayload>[]
          }
          delete: {
            args: Prisma.ScrapeJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeJobPayload>
          }
          update: {
            args: Prisma.ScrapeJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeJobPayload>
          }
          deleteMany: {
            args: Prisma.ScrapeJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScrapeJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScrapeJobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeJobPayload>[]
          }
          upsert: {
            args: Prisma.ScrapeJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScrapeJobPayload>
          }
          aggregate: {
            args: Prisma.ScrapeJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScrapeJob>
          }
          groupBy: {
            args: Prisma.ScrapeJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScrapeJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScrapeJobCountArgs<ExtArgs>
            result: $Utils.Optional<ScrapeJobCountAggregateOutputType> | number
          }
        }
      }
      AgentAccount: {
        payload: Prisma.$AgentAccountPayload<ExtArgs>
        fields: Prisma.AgentAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAccountPayload>
          }
          findFirst: {
            args: Prisma.AgentAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAccountPayload>
          }
          findMany: {
            args: Prisma.AgentAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAccountPayload>[]
          }
          create: {
            args: Prisma.AgentAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAccountPayload>
          }
          createMany: {
            args: Prisma.AgentAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAccountPayload>[]
          }
          delete: {
            args: Prisma.AgentAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAccountPayload>
          }
          update: {
            args: Prisma.AgentAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAccountPayload>
          }
          deleteMany: {
            args: Prisma.AgentAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAccountPayload>[]
          }
          upsert: {
            args: Prisma.AgentAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentAccountPayload>
          }
          aggregate: {
            args: Prisma.AgentAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentAccount>
          }
          groupBy: {
            args: Prisma.AgentAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentAccountCountArgs<ExtArgs>
            result: $Utils.Optional<AgentAccountCountAggregateOutputType> | number
          }
        }
      }
      LoginToken: {
        payload: Prisma.$LoginTokenPayload<ExtArgs>
        fields: Prisma.LoginTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoginTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoginTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginTokenPayload>
          }
          findFirst: {
            args: Prisma.LoginTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoginTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginTokenPayload>
          }
          findMany: {
            args: Prisma.LoginTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginTokenPayload>[]
          }
          create: {
            args: Prisma.LoginTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginTokenPayload>
          }
          createMany: {
            args: Prisma.LoginTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoginTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginTokenPayload>[]
          }
          delete: {
            args: Prisma.LoginTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginTokenPayload>
          }
          update: {
            args: Prisma.LoginTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginTokenPayload>
          }
          deleteMany: {
            args: Prisma.LoginTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoginTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LoginTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginTokenPayload>[]
          }
          upsert: {
            args: Prisma.LoginTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginTokenPayload>
          }
          aggregate: {
            args: Prisma.LoginTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoginToken>
          }
          groupBy: {
            args: Prisma.LoginTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoginTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoginTokenCountArgs<ExtArgs>
            result: $Utils.Optional<LoginTokenCountAggregateOutputType> | number
          }
        }
      }
      LoginAudit: {
        payload: Prisma.$LoginAuditPayload<ExtArgs>
        fields: Prisma.LoginAuditFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoginAuditFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAuditPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoginAuditFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAuditPayload>
          }
          findFirst: {
            args: Prisma.LoginAuditFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAuditPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoginAuditFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAuditPayload>
          }
          findMany: {
            args: Prisma.LoginAuditFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAuditPayload>[]
          }
          create: {
            args: Prisma.LoginAuditCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAuditPayload>
          }
          createMany: {
            args: Prisma.LoginAuditCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoginAuditCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAuditPayload>[]
          }
          delete: {
            args: Prisma.LoginAuditDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAuditPayload>
          }
          update: {
            args: Prisma.LoginAuditUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAuditPayload>
          }
          deleteMany: {
            args: Prisma.LoginAuditDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoginAuditUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LoginAuditUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAuditPayload>[]
          }
          upsert: {
            args: Prisma.LoginAuditUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAuditPayload>
          }
          aggregate: {
            args: Prisma.LoginAuditAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoginAudit>
          }
          groupBy: {
            args: Prisma.LoginAuditGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoginAuditGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoginAuditCountArgs<ExtArgs>
            result: $Utils.Optional<LoginAuditCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    order?: OrderOmit
    chatSession?: ChatSessionOmit
    ticket?: TicketOmit
    conversationMessage?: ConversationMessageOmit
    agentAssignment?: AgentAssignmentOmit
    handoffRequest?: HandoffRequestOmit
    scrapeJob?: ScrapeJobOmit
    agentAccount?: AgentAccountOmit
    loginToken?: LoginTokenOmit
    loginAudit?: LoginAuditOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    orders: number
    sessions: number
    tickets: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | UserCountOutputTypeCountOrdersArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    tickets?: boolean | UserCountOutputTypeCountTicketsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
  }


  /**
   * Count Type AgentAccountCountOutputType
   */

  export type AgentAccountCountOutputType = {
    loginTokens: number
    audits: number
  }

  export type AgentAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loginTokens?: boolean | AgentAccountCountOutputTypeCountLoginTokensArgs
    audits?: boolean | AgentAccountCountOutputTypeCountAuditsArgs
  }

  // Custom InputTypes
  /**
   * AgentAccountCountOutputType without action
   */
  export type AgentAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAccountCountOutputType
     */
    select?: AgentAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AgentAccountCountOutputType without action
   */
  export type AgentAccountCountOutputTypeCountLoginTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginTokenWhereInput
  }

  /**
   * AgentAccountCountOutputType without action
   */
  export type AgentAccountCountOutputTypeCountAuditsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginAuditWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    phone: string | null
    address: string | null
    longSummary: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    phone: string | null
    address: string | null
    longSummary: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    phone: number
    address: number
    longSummary: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    phone?: true
    address?: true
    longSummary?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    phone?: true
    address?: true
    longSummary?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    phone?: true
    address?: true
    longSummary?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    phone: string | null
    address: string | null
    longSummary: string | null
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    phone?: boolean
    address?: boolean
    longSummary?: boolean
    createdAt?: boolean
    orders?: boolean | User$ordersArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    tickets?: boolean | User$ticketsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    phone?: boolean
    address?: boolean
    longSummary?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    phone?: boolean
    address?: boolean
    longSummary?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    phone?: boolean
    address?: boolean
    longSummary?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "phone" | "address" | "longSummary" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | User$ordersArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    tickets?: boolean | User$ticketsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      orders: Prisma.$OrderPayload<ExtArgs>[]
      sessions: Prisma.$ChatSessionPayload<ExtArgs>[]
      tickets: Prisma.$TicketPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      phone: string | null
      address: string | null
      longSummary: string | null
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    orders<T extends User$ordersArgs<ExtArgs> = {}>(args?: Subset<T, User$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tickets<T extends User$ticketsArgs<ExtArgs> = {}>(args?: Subset<T, User$ticketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly longSummary: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.orders
   */
  export type User$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    cursor?: OrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    where?: ChatSessionWhereInput
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    cursor?: ChatSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * User.tickets
   */
  export type User$ticketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    cursor?: TicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Order
   */

  export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  export type OrderMinAggregateOutputType = {
    id: string | null
    userId: string | null
    orderId: string | null
    createdAt: Date | null
    status: string | null
  }

  export type OrderMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    orderId: string | null
    createdAt: Date | null
    status: string | null
  }

  export type OrderCountAggregateOutputType = {
    id: number
    userId: number
    orderId: number
    createdAt: number
    status: number
    _all: number
  }


  export type OrderMinAggregateInputType = {
    id?: true
    userId?: true
    orderId?: true
    createdAt?: true
    status?: true
  }

  export type OrderMaxAggregateInputType = {
    id?: true
    userId?: true
    orderId?: true
    createdAt?: true
    status?: true
  }

  export type OrderCountAggregateInputType = {
    id?: true
    userId?: true
    orderId?: true
    createdAt?: true
    status?: true
    _all?: true
  }

  export type OrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Order to aggregate.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Orders
    **/
    _count?: true | OrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType
  }

  export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
        [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrder[P]>
      : GetScalarType<T[P], AggregateOrder[P]>
  }




  export type OrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderWhereInput
    orderBy?: OrderOrderByWithAggregationInput | OrderOrderByWithAggregationInput[]
    by: OrderScalarFieldEnum[] | OrderScalarFieldEnum
    having?: OrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderCountAggregateInputType | true
    _min?: OrderMinAggregateInputType
    _max?: OrderMaxAggregateInputType
  }

  export type OrderGroupByOutputType = {
    id: string
    userId: string | null
    orderId: string
    createdAt: Date
    status: string | null
    _count: OrderCountAggregateOutputType | null
    _min: OrderMinAggregateOutputType | null
    _max: OrderMaxAggregateOutputType | null
  }

  type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderGroupByOutputType[P]>
            : GetScalarType<T[P], OrderGroupByOutputType[P]>
        }
      >
    >


  export type OrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    orderId?: boolean
    createdAt?: boolean
    status?: boolean
    user?: boolean | Order$userArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    orderId?: boolean
    createdAt?: boolean
    status?: boolean
    user?: boolean | Order$userArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    orderId?: boolean
    createdAt?: boolean
    status?: boolean
    user?: boolean | Order$userArgs<ExtArgs>
  }, ExtArgs["result"]["order"]>

  export type OrderSelectScalar = {
    id?: boolean
    userId?: boolean
    orderId?: boolean
    createdAt?: boolean
    status?: boolean
  }

  export type OrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "orderId" | "createdAt" | "status", ExtArgs["result"]["order"]>
  export type OrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Order$userArgs<ExtArgs>
  }
  export type OrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Order$userArgs<ExtArgs>
  }
  export type OrderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Order$userArgs<ExtArgs>
  }

  export type $OrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Order"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      orderId: string
      createdAt: Date
      status: string | null
    }, ExtArgs["result"]["order"]>
    composites: {}
  }

  type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = $Result.GetResult<Prisma.$OrderPayload, S>

  type OrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderCountAggregateInputType | true
    }

  export interface OrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Order'], meta: { name: 'Order' } }
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(args: SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(args?: SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     * 
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderFindManyArgs>(args?: SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     * 
     */
    create<T extends OrderCreateArgs>(args: SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderCreateManyArgs>(args?: SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Orders and returns the data saved in the database.
     * @param {OrderCreateManyAndReturnArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     * 
     */
    delete<T extends OrderDeleteArgs>(args: SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderUpdateArgs>(args: SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderDeleteManyArgs>(args?: SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderUpdateManyArgs>(args: SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Orders and returns the data updated in the database.
     * @param {OrderUpdateManyAndReturnArgs} args - Arguments to update many Orders.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrderUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(args: SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma__OrderClient<$Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends OrderCountArgs>(
      args?: Subset<T, OrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderAggregateArgs>(args: Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>

    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderGroupByArgs['orderBy'] }
        : { orderBy?: OrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Order model
   */
  readonly fields: OrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Order.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Order$userArgs<ExtArgs> = {}>(args?: Subset<T, Order$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Order model
   */
  interface OrderFieldRefs {
    readonly id: FieldRef<"Order", 'String'>
    readonly userId: FieldRef<"Order", 'String'>
    readonly orderId: FieldRef<"Order", 'String'>
    readonly createdAt: FieldRef<"Order", 'DateTime'>
    readonly status: FieldRef<"Order", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Order findUnique
   */
  export type OrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findUniqueOrThrow
   */
  export type OrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order findFirst
   */
  export type OrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findFirstOrThrow
   */
  export type OrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order findMany
   */
  export type OrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter, which Orders to fetch.
     */
    where?: OrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Orders.
     */
    cursor?: OrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Orders.
     */
    skip?: number
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[]
  }

  /**
   * Order create
   */
  export type OrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to create a Order.
     */
    data: XOR<OrderCreateInput, OrderUncheckedCreateInput>
  }

  /**
   * Order createMany
   */
  export type OrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Order createManyAndReturn
   */
  export type OrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Order update
   */
  export type OrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The data needed to update a Order.
     */
    data: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
    /**
     * Choose, which Order to update.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order updateMany
   */
  export type OrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
  }

  /**
   * Order updateManyAndReturn
   */
  export type OrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Order upsert
   */
  export type OrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: OrderWhereUniqueInput
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: XOR<OrderCreateInput, OrderUncheckedCreateInput>
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>
  }

  /**
   * Order delete
   */
  export type OrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
    /**
     * Filter which Order to delete.
     */
    where: OrderWhereUniqueInput
  }

  /**
   * Order deleteMany
   */
  export type OrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Orders to delete
     */
    where?: OrderWhereInput
    /**
     * Limit how many Orders to delete.
     */
    limit?: number
  }

  /**
   * Order.user
   */
  export type Order$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Order without action
   */
  export type OrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Order
     */
    omit?: OrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null
  }


  /**
   * Model ChatSession
   */

  export type AggregateChatSession = {
    _count: ChatSessionCountAggregateOutputType | null
    _avg: ChatSessionAvgAggregateOutputType | null
    _sum: ChatSessionSumAggregateOutputType | null
    _min: ChatSessionMinAggregateOutputType | null
    _max: ChatSessionMaxAggregateOutputType | null
  }

  export type ChatSessionAvgAggregateOutputType = {
    lastSummarizedIndex: number | null
    unsummarizedLimit: number | null
  }

  export type ChatSessionSumAggregateOutputType = {
    lastSummarizedIndex: number | null
    unsummarizedLimit: number | null
  }

  export type ChatSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    endedAt: Date | null
    summary: string | null
    lastSummarizedIndex: number | null
    unsummarizedLimit: number | null
  }

  export type ChatSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    endedAt: Date | null
    summary: string | null
    lastSummarizedIndex: number | null
    unsummarizedLimit: number | null
  }

  export type ChatSessionCountAggregateOutputType = {
    id: number
    userId: number
    createdAt: number
    updatedAt: number
    endedAt: number
    messages: number
    summary: number
    lastSummarizedIndex: number
    unsummarizedLimit: number
    _all: number
  }


  export type ChatSessionAvgAggregateInputType = {
    lastSummarizedIndex?: true
    unsummarizedLimit?: true
  }

  export type ChatSessionSumAggregateInputType = {
    lastSummarizedIndex?: true
    unsummarizedLimit?: true
  }

  export type ChatSessionMinAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    endedAt?: true
    summary?: true
    lastSummarizedIndex?: true
    unsummarizedLimit?: true
  }

  export type ChatSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    endedAt?: true
    summary?: true
    lastSummarizedIndex?: true
    unsummarizedLimit?: true
  }

  export type ChatSessionCountAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    endedAt?: true
    messages?: true
    summary?: true
    lastSummarizedIndex?: true
    unsummarizedLimit?: true
    _all?: true
  }

  export type ChatSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatSession to aggregate.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatSessions
    **/
    _count?: true | ChatSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChatSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChatSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatSessionMaxAggregateInputType
  }

  export type GetChatSessionAggregateType<T extends ChatSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateChatSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatSession[P]>
      : GetScalarType<T[P], AggregateChatSession[P]>
  }




  export type ChatSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
    orderBy?: ChatSessionOrderByWithAggregationInput | ChatSessionOrderByWithAggregationInput[]
    by: ChatSessionScalarFieldEnum[] | ChatSessionScalarFieldEnum
    having?: ChatSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatSessionCountAggregateInputType | true
    _avg?: ChatSessionAvgAggregateInputType
    _sum?: ChatSessionSumAggregateInputType
    _min?: ChatSessionMinAggregateInputType
    _max?: ChatSessionMaxAggregateInputType
  }

  export type ChatSessionGroupByOutputType = {
    id: string
    userId: string
    createdAt: Date
    updatedAt: Date
    endedAt: Date | null
    messages: JsonValue
    summary: string | null
    lastSummarizedIndex: number
    unsummarizedLimit: number
    _count: ChatSessionCountAggregateOutputType | null
    _avg: ChatSessionAvgAggregateOutputType | null
    _sum: ChatSessionSumAggregateOutputType | null
    _min: ChatSessionMinAggregateOutputType | null
    _max: ChatSessionMaxAggregateOutputType | null
  }

  type GetChatSessionGroupByPayload<T extends ChatSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatSessionGroupByOutputType[P]>
            : GetScalarType<T[P], ChatSessionGroupByOutputType[P]>
        }
      >
    >


  export type ChatSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    endedAt?: boolean
    messages?: boolean
    summary?: boolean
    lastSummarizedIndex?: boolean
    unsummarizedLimit?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    endedAt?: boolean
    messages?: boolean
    summary?: boolean
    lastSummarizedIndex?: boolean
    unsummarizedLimit?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    endedAt?: boolean
    messages?: boolean
    summary?: boolean
    lastSummarizedIndex?: boolean
    unsummarizedLimit?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    endedAt?: boolean
    messages?: boolean
    summary?: boolean
    lastSummarizedIndex?: boolean
    unsummarizedLimit?: boolean
  }

  export type ChatSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "createdAt" | "updatedAt" | "endedAt" | "messages" | "summary" | "lastSummarizedIndex" | "unsummarizedLimit", ExtArgs["result"]["chatSession"]>
  export type ChatSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ChatSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ChatSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ChatSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      createdAt: Date
      updatedAt: Date
      endedAt: Date | null
      messages: Prisma.JsonValue
      summary: string | null
      lastSummarizedIndex: number
      unsummarizedLimit: number
    }, ExtArgs["result"]["chatSession"]>
    composites: {}
  }

  type ChatSessionGetPayload<S extends boolean | null | undefined | ChatSessionDefaultArgs> = $Result.GetResult<Prisma.$ChatSessionPayload, S>

  type ChatSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatSessionCountAggregateInputType | true
    }

  export interface ChatSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatSession'], meta: { name: 'ChatSession' } }
    /**
     * Find zero or one ChatSession that matches the filter.
     * @param {ChatSessionFindUniqueArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatSessionFindUniqueArgs>(args: SelectSubset<T, ChatSessionFindUniqueArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatSessionFindUniqueOrThrowArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindFirstArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatSessionFindFirstArgs>(args?: SelectSubset<T, ChatSessionFindFirstArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindFirstOrThrowArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatSessions
     * const chatSessions = await prisma.chatSession.findMany()
     * 
     * // Get first 10 ChatSessions
     * const chatSessions = await prisma.chatSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatSessionFindManyArgs>(args?: SelectSubset<T, ChatSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatSession.
     * @param {ChatSessionCreateArgs} args - Arguments to create a ChatSession.
     * @example
     * // Create one ChatSession
     * const ChatSession = await prisma.chatSession.create({
     *   data: {
     *     // ... data to create a ChatSession
     *   }
     * })
     * 
     */
    create<T extends ChatSessionCreateArgs>(args: SelectSubset<T, ChatSessionCreateArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatSessions.
     * @param {ChatSessionCreateManyArgs} args - Arguments to create many ChatSessions.
     * @example
     * // Create many ChatSessions
     * const chatSession = await prisma.chatSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatSessionCreateManyArgs>(args?: SelectSubset<T, ChatSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatSessions and returns the data saved in the database.
     * @param {ChatSessionCreateManyAndReturnArgs} args - Arguments to create many ChatSessions.
     * @example
     * // Create many ChatSessions
     * const chatSession = await prisma.chatSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatSessions and only return the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatSession.
     * @param {ChatSessionDeleteArgs} args - Arguments to delete one ChatSession.
     * @example
     * // Delete one ChatSession
     * const ChatSession = await prisma.chatSession.delete({
     *   where: {
     *     // ... filter to delete one ChatSession
     *   }
     * })
     * 
     */
    delete<T extends ChatSessionDeleteArgs>(args: SelectSubset<T, ChatSessionDeleteArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatSession.
     * @param {ChatSessionUpdateArgs} args - Arguments to update one ChatSession.
     * @example
     * // Update one ChatSession
     * const chatSession = await prisma.chatSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatSessionUpdateArgs>(args: SelectSubset<T, ChatSessionUpdateArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatSessions.
     * @param {ChatSessionDeleteManyArgs} args - Arguments to filter ChatSessions to delete.
     * @example
     * // Delete a few ChatSessions
     * const { count } = await prisma.chatSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatSessionDeleteManyArgs>(args?: SelectSubset<T, ChatSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatSessions
     * const chatSession = await prisma.chatSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatSessionUpdateManyArgs>(args: SelectSubset<T, ChatSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatSessions and returns the data updated in the database.
     * @param {ChatSessionUpdateManyAndReturnArgs} args - Arguments to update many ChatSessions.
     * @example
     * // Update many ChatSessions
     * const chatSession = await prisma.chatSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatSessions and only return the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatSession.
     * @param {ChatSessionUpsertArgs} args - Arguments to update or create a ChatSession.
     * @example
     * // Update or create a ChatSession
     * const chatSession = await prisma.chatSession.upsert({
     *   create: {
     *     // ... data to create a ChatSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatSession we want to update
     *   }
     * })
     */
    upsert<T extends ChatSessionUpsertArgs>(args: SelectSubset<T, ChatSessionUpsertArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionCountArgs} args - Arguments to filter ChatSessions to count.
     * @example
     * // Count the number of ChatSessions
     * const count = await prisma.chatSession.count({
     *   where: {
     *     // ... the filter for the ChatSessions we want to count
     *   }
     * })
    **/
    count<T extends ChatSessionCountArgs>(
      args?: Subset<T, ChatSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatSessionAggregateArgs>(args: Subset<T, ChatSessionAggregateArgs>): Prisma.PrismaPromise<GetChatSessionAggregateType<T>>

    /**
     * Group by ChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatSessionGroupByArgs['orderBy'] }
        : { orderBy?: ChatSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatSession model
   */
  readonly fields: ChatSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatSession model
   */
  interface ChatSessionFieldRefs {
    readonly id: FieldRef<"ChatSession", 'String'>
    readonly userId: FieldRef<"ChatSession", 'String'>
    readonly createdAt: FieldRef<"ChatSession", 'DateTime'>
    readonly updatedAt: FieldRef<"ChatSession", 'DateTime'>
    readonly endedAt: FieldRef<"ChatSession", 'DateTime'>
    readonly messages: FieldRef<"ChatSession", 'Json'>
    readonly summary: FieldRef<"ChatSession", 'String'>
    readonly lastSummarizedIndex: FieldRef<"ChatSession", 'Int'>
    readonly unsummarizedLimit: FieldRef<"ChatSession", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ChatSession findUnique
   */
  export type ChatSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession findUniqueOrThrow
   */
  export type ChatSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession findFirst
   */
  export type ChatSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatSessions.
     */
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession findFirstOrThrow
   */
  export type ChatSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatSessions.
     */
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession findMany
   */
  export type ChatSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSessions to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession create
   */
  export type ChatSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatSession.
     */
    data: XOR<ChatSessionCreateInput, ChatSessionUncheckedCreateInput>
  }

  /**
   * ChatSession createMany
   */
  export type ChatSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatSessions.
     */
    data: ChatSessionCreateManyInput | ChatSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatSession createManyAndReturn
   */
  export type ChatSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * The data used to create many ChatSessions.
     */
    data: ChatSessionCreateManyInput | ChatSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatSession update
   */
  export type ChatSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatSession.
     */
    data: XOR<ChatSessionUpdateInput, ChatSessionUncheckedUpdateInput>
    /**
     * Choose, which ChatSession to update.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession updateMany
   */
  export type ChatSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatSessions.
     */
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyInput>
    /**
     * Filter which ChatSessions to update
     */
    where?: ChatSessionWhereInput
    /**
     * Limit how many ChatSessions to update.
     */
    limit?: number
  }

  /**
   * ChatSession updateManyAndReturn
   */
  export type ChatSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * The data used to update ChatSessions.
     */
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyInput>
    /**
     * Filter which ChatSessions to update
     */
    where?: ChatSessionWhereInput
    /**
     * Limit how many ChatSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatSession upsert
   */
  export type ChatSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatSession to update in case it exists.
     */
    where: ChatSessionWhereUniqueInput
    /**
     * In case the ChatSession found by the `where` argument doesn't exist, create a new ChatSession with this data.
     */
    create: XOR<ChatSessionCreateInput, ChatSessionUncheckedCreateInput>
    /**
     * In case the ChatSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatSessionUpdateInput, ChatSessionUncheckedUpdateInput>
  }

  /**
   * ChatSession delete
   */
  export type ChatSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter which ChatSession to delete.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession deleteMany
   */
  export type ChatSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatSessions to delete
     */
    where?: ChatSessionWhereInput
    /**
     * Limit how many ChatSessions to delete.
     */
    limit?: number
  }

  /**
   * ChatSession without action
   */
  export type ChatSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
  }


  /**
   * Model Ticket
   */

  export type AggregateTicket = {
    _count: TicketCountAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  export type TicketMinAggregateOutputType = {
    id: string | null
    ticket: string | null
    createdAt: Date | null
    userId: string | null
  }

  export type TicketMaxAggregateOutputType = {
    id: string | null
    ticket: string | null
    createdAt: Date | null
    userId: string | null
  }

  export type TicketCountAggregateOutputType = {
    id: number
    ticket: number
    createdAt: number
    userId: number
    _all: number
  }


  export type TicketMinAggregateInputType = {
    id?: true
    ticket?: true
    createdAt?: true
    userId?: true
  }

  export type TicketMaxAggregateInputType = {
    id?: true
    ticket?: true
    createdAt?: true
    userId?: true
  }

  export type TicketCountAggregateInputType = {
    id?: true
    ticket?: true
    createdAt?: true
    userId?: true
    _all?: true
  }

  export type TicketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ticket to aggregate.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tickets
    **/
    _count?: true | TicketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketMaxAggregateInputType
  }

  export type GetTicketAggregateType<T extends TicketAggregateArgs> = {
        [P in keyof T & keyof AggregateTicket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicket[P]>
      : GetScalarType<T[P], AggregateTicket[P]>
  }




  export type TicketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithAggregationInput | TicketOrderByWithAggregationInput[]
    by: TicketScalarFieldEnum[] | TicketScalarFieldEnum
    having?: TicketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketCountAggregateInputType | true
    _min?: TicketMinAggregateInputType
    _max?: TicketMaxAggregateInputType
  }

  export type TicketGroupByOutputType = {
    id: string
    ticket: string
    createdAt: Date
    userId: string | null
    _count: TicketCountAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  type GetTicketGroupByPayload<T extends TicketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TicketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketGroupByOutputType[P]>
            : GetScalarType<T[P], TicketGroupByOutputType[P]>
        }
      >
    >


  export type TicketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticket?: boolean
    createdAt?: boolean
    userId?: boolean
    user?: boolean | Ticket$userArgs<ExtArgs>
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticket?: boolean
    createdAt?: boolean
    userId?: boolean
    user?: boolean | Ticket$userArgs<ExtArgs>
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticket?: boolean
    createdAt?: boolean
    userId?: boolean
    user?: boolean | Ticket$userArgs<ExtArgs>
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectScalar = {
    id?: boolean
    ticket?: boolean
    createdAt?: boolean
    userId?: boolean
  }

  export type TicketOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ticket" | "createdAt" | "userId", ExtArgs["result"]["ticket"]>
  export type TicketInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Ticket$userArgs<ExtArgs>
  }
  export type TicketIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Ticket$userArgs<ExtArgs>
  }
  export type TicketIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Ticket$userArgs<ExtArgs>
  }

  export type $TicketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ticket"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ticket: string
      createdAt: Date
      userId: string | null
    }, ExtArgs["result"]["ticket"]>
    composites: {}
  }

  type TicketGetPayload<S extends boolean | null | undefined | TicketDefaultArgs> = $Result.GetResult<Prisma.$TicketPayload, S>

  type TicketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TicketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TicketCountAggregateInputType | true
    }

  export interface TicketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ticket'], meta: { name: 'Ticket' } }
    /**
     * Find zero or one Ticket that matches the filter.
     * @param {TicketFindUniqueArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketFindUniqueArgs>(args: SelectSubset<T, TicketFindUniqueArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ticket that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketFindUniqueOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketFindUniqueOrThrowArgs>(args: SelectSubset<T, TicketFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ticket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketFindFirstArgs>(args?: SelectSubset<T, TicketFindFirstArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ticket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketFindFirstOrThrowArgs>(args?: SelectSubset<T, TicketFindFirstOrThrowArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tickets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tickets
     * const tickets = await prisma.ticket.findMany()
     * 
     * // Get first 10 Tickets
     * const tickets = await prisma.ticket.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ticketWithIdOnly = await prisma.ticket.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TicketFindManyArgs>(args?: SelectSubset<T, TicketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ticket.
     * @param {TicketCreateArgs} args - Arguments to create a Ticket.
     * @example
     * // Create one Ticket
     * const Ticket = await prisma.ticket.create({
     *   data: {
     *     // ... data to create a Ticket
     *   }
     * })
     * 
     */
    create<T extends TicketCreateArgs>(args: SelectSubset<T, TicketCreateArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tickets.
     * @param {TicketCreateManyArgs} args - Arguments to create many Tickets.
     * @example
     * // Create many Tickets
     * const ticket = await prisma.ticket.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TicketCreateManyArgs>(args?: SelectSubset<T, TicketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tickets and returns the data saved in the database.
     * @param {TicketCreateManyAndReturnArgs} args - Arguments to create many Tickets.
     * @example
     * // Create many Tickets
     * const ticket = await prisma.ticket.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tickets and only return the `id`
     * const ticketWithIdOnly = await prisma.ticket.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TicketCreateManyAndReturnArgs>(args?: SelectSubset<T, TicketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Ticket.
     * @param {TicketDeleteArgs} args - Arguments to delete one Ticket.
     * @example
     * // Delete one Ticket
     * const Ticket = await prisma.ticket.delete({
     *   where: {
     *     // ... filter to delete one Ticket
     *   }
     * })
     * 
     */
    delete<T extends TicketDeleteArgs>(args: SelectSubset<T, TicketDeleteArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ticket.
     * @param {TicketUpdateArgs} args - Arguments to update one Ticket.
     * @example
     * // Update one Ticket
     * const ticket = await prisma.ticket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TicketUpdateArgs>(args: SelectSubset<T, TicketUpdateArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tickets.
     * @param {TicketDeleteManyArgs} args - Arguments to filter Tickets to delete.
     * @example
     * // Delete a few Tickets
     * const { count } = await prisma.ticket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TicketDeleteManyArgs>(args?: SelectSubset<T, TicketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TicketUpdateManyArgs>(args: SelectSubset<T, TicketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tickets and returns the data updated in the database.
     * @param {TicketUpdateManyAndReturnArgs} args - Arguments to update many Tickets.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tickets and only return the `id`
     * const ticketWithIdOnly = await prisma.ticket.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TicketUpdateManyAndReturnArgs>(args: SelectSubset<T, TicketUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Ticket.
     * @param {TicketUpsertArgs} args - Arguments to update or create a Ticket.
     * @example
     * // Update or create a Ticket
     * const ticket = await prisma.ticket.upsert({
     *   create: {
     *     // ... data to create a Ticket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ticket we want to update
     *   }
     * })
     */
    upsert<T extends TicketUpsertArgs>(args: SelectSubset<T, TicketUpsertArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCountArgs} args - Arguments to filter Tickets to count.
     * @example
     * // Count the number of Tickets
     * const count = await prisma.ticket.count({
     *   where: {
     *     // ... the filter for the Tickets we want to count
     *   }
     * })
    **/
    count<T extends TicketCountArgs>(
      args?: Subset<T, TicketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TicketAggregateArgs>(args: Subset<T, TicketAggregateArgs>): Prisma.PrismaPromise<GetTicketAggregateType<T>>

    /**
     * Group by Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TicketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketGroupByArgs['orderBy'] }
        : { orderBy?: TicketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ticket model
   */
  readonly fields: TicketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ticket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Ticket$userArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Ticket model
   */
  interface TicketFieldRefs {
    readonly id: FieldRef<"Ticket", 'String'>
    readonly ticket: FieldRef<"Ticket", 'String'>
    readonly createdAt: FieldRef<"Ticket", 'DateTime'>
    readonly userId: FieldRef<"Ticket", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Ticket findUnique
   */
  export type TicketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket findUniqueOrThrow
   */
  export type TicketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket findFirst
   */
  export type TicketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket findFirstOrThrow
   */
  export type TicketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket findMany
   */
  export type TicketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Tickets to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket create
   */
  export type TicketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The data needed to create a Ticket.
     */
    data: XOR<TicketCreateInput, TicketUncheckedCreateInput>
  }

  /**
   * Ticket createMany
   */
  export type TicketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tickets.
     */
    data: TicketCreateManyInput | TicketCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ticket createManyAndReturn
   */
  export type TicketCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * The data used to create many Tickets.
     */
    data: TicketCreateManyInput | TicketCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ticket update
   */
  export type TicketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The data needed to update a Ticket.
     */
    data: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
    /**
     * Choose, which Ticket to update.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket updateMany
   */
  export type TicketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tickets.
     */
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>
    /**
     * Filter which Tickets to update
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to update.
     */
    limit?: number
  }

  /**
   * Ticket updateManyAndReturn
   */
  export type TicketUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * The data used to update Tickets.
     */
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>
    /**
     * Filter which Tickets to update
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ticket upsert
   */
  export type TicketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The filter to search for the Ticket to update in case it exists.
     */
    where: TicketWhereUniqueInput
    /**
     * In case the Ticket found by the `where` argument doesn't exist, create a new Ticket with this data.
     */
    create: XOR<TicketCreateInput, TicketUncheckedCreateInput>
    /**
     * In case the Ticket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
  }

  /**
   * Ticket delete
   */
  export type TicketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter which Ticket to delete.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket deleteMany
   */
  export type TicketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tickets to delete
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to delete.
     */
    limit?: number
  }

  /**
   * Ticket.user
   */
  export type Ticket$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Ticket without action
   */
  export type TicketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
  }


  /**
   * Model ConversationMessage
   */

  export type AggregateConversationMessage = {
    _count: ConversationMessageCountAggregateOutputType | null
    _avg: ConversationMessageAvgAggregateOutputType | null
    _sum: ConversationMessageSumAggregateOutputType | null
    _min: ConversationMessageMinAggregateOutputType | null
    _max: ConversationMessageMaxAggregateOutputType | null
  }

  export type ConversationMessageAvgAggregateOutputType = {
    id: number | null
    messageId: number | null
    conversationId: number | null
    inboxId: number | null
  }

  export type ConversationMessageSumAggregateOutputType = {
    id: number | null
    messageId: number | null
    conversationId: number | null
    inboxId: number | null
  }

  export type ConversationMessageMinAggregateOutputType = {
    id: number | null
    messageId: number | null
    conversationId: number | null
    inboxId: number | null
    conversationKey: string | null
    sender: string | null
    content: string | null
    createdAt: Date | null
  }

  export type ConversationMessageMaxAggregateOutputType = {
    id: number | null
    messageId: number | null
    conversationId: number | null
    inboxId: number | null
    conversationKey: string | null
    sender: string | null
    content: string | null
    createdAt: Date | null
  }

  export type ConversationMessageCountAggregateOutputType = {
    id: number
    messageId: number
    conversationId: number
    inboxId: number
    conversationKey: number
    sender: number
    content: number
    createdAt: number
    _all: number
  }


  export type ConversationMessageAvgAggregateInputType = {
    id?: true
    messageId?: true
    conversationId?: true
    inboxId?: true
  }

  export type ConversationMessageSumAggregateInputType = {
    id?: true
    messageId?: true
    conversationId?: true
    inboxId?: true
  }

  export type ConversationMessageMinAggregateInputType = {
    id?: true
    messageId?: true
    conversationId?: true
    inboxId?: true
    conversationKey?: true
    sender?: true
    content?: true
    createdAt?: true
  }

  export type ConversationMessageMaxAggregateInputType = {
    id?: true
    messageId?: true
    conversationId?: true
    inboxId?: true
    conversationKey?: true
    sender?: true
    content?: true
    createdAt?: true
  }

  export type ConversationMessageCountAggregateInputType = {
    id?: true
    messageId?: true
    conversationId?: true
    inboxId?: true
    conversationKey?: true
    sender?: true
    content?: true
    createdAt?: true
    _all?: true
  }

  export type ConversationMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConversationMessage to aggregate.
     */
    where?: ConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationMessages to fetch.
     */
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConversationMessages
    **/
    _count?: true | ConversationMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ConversationMessageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ConversationMessageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConversationMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConversationMessageMaxAggregateInputType
  }

  export type GetConversationMessageAggregateType<T extends ConversationMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateConversationMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConversationMessage[P]>
      : GetScalarType<T[P], AggregateConversationMessage[P]>
  }




  export type ConversationMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationMessageWhereInput
    orderBy?: ConversationMessageOrderByWithAggregationInput | ConversationMessageOrderByWithAggregationInput[]
    by: ConversationMessageScalarFieldEnum[] | ConversationMessageScalarFieldEnum
    having?: ConversationMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConversationMessageCountAggregateInputType | true
    _avg?: ConversationMessageAvgAggregateInputType
    _sum?: ConversationMessageSumAggregateInputType
    _min?: ConversationMessageMinAggregateInputType
    _max?: ConversationMessageMaxAggregateInputType
  }

  export type ConversationMessageGroupByOutputType = {
    id: number
    messageId: number
    conversationId: number
    inboxId: number
    conversationKey: string
    sender: string
    content: string
    createdAt: Date
    _count: ConversationMessageCountAggregateOutputType | null
    _avg: ConversationMessageAvgAggregateOutputType | null
    _sum: ConversationMessageSumAggregateOutputType | null
    _min: ConversationMessageMinAggregateOutputType | null
    _max: ConversationMessageMaxAggregateOutputType | null
  }

  type GetConversationMessageGroupByPayload<T extends ConversationMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConversationMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConversationMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConversationMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ConversationMessageGroupByOutputType[P]>
        }
      >
    >


  export type ConversationMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messageId?: boolean
    conversationId?: boolean
    inboxId?: boolean
    conversationKey?: boolean
    sender?: boolean
    content?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["conversationMessage"]>

  export type ConversationMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messageId?: boolean
    conversationId?: boolean
    inboxId?: boolean
    conversationKey?: boolean
    sender?: boolean
    content?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["conversationMessage"]>

  export type ConversationMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messageId?: boolean
    conversationId?: boolean
    inboxId?: boolean
    conversationKey?: boolean
    sender?: boolean
    content?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["conversationMessage"]>

  export type ConversationMessageSelectScalar = {
    id?: boolean
    messageId?: boolean
    conversationId?: boolean
    inboxId?: boolean
    conversationKey?: boolean
    sender?: boolean
    content?: boolean
    createdAt?: boolean
  }

  export type ConversationMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "messageId" | "conversationId" | "inboxId" | "conversationKey" | "sender" | "content" | "createdAt", ExtArgs["result"]["conversationMessage"]>

  export type $ConversationMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConversationMessage"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      messageId: number
      conversationId: number
      inboxId: number
      conversationKey: string
      sender: string
      content: string
      createdAt: Date
    }, ExtArgs["result"]["conversationMessage"]>
    composites: {}
  }

  type ConversationMessageGetPayload<S extends boolean | null | undefined | ConversationMessageDefaultArgs> = $Result.GetResult<Prisma.$ConversationMessagePayload, S>

  type ConversationMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConversationMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConversationMessageCountAggregateInputType | true
    }

  export interface ConversationMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConversationMessage'], meta: { name: 'ConversationMessage' } }
    /**
     * Find zero or one ConversationMessage that matches the filter.
     * @param {ConversationMessageFindUniqueArgs} args - Arguments to find a ConversationMessage
     * @example
     * // Get one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConversationMessageFindUniqueArgs>(args: SelectSubset<T, ConversationMessageFindUniqueArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConversationMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConversationMessageFindUniqueOrThrowArgs} args - Arguments to find a ConversationMessage
     * @example
     * // Get one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConversationMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ConversationMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConversationMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageFindFirstArgs} args - Arguments to find a ConversationMessage
     * @example
     * // Get one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConversationMessageFindFirstArgs>(args?: SelectSubset<T, ConversationMessageFindFirstArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConversationMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageFindFirstOrThrowArgs} args - Arguments to find a ConversationMessage
     * @example
     * // Get one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConversationMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ConversationMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConversationMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConversationMessages
     * const conversationMessages = await prisma.conversationMessage.findMany()
     * 
     * // Get first 10 ConversationMessages
     * const conversationMessages = await prisma.conversationMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conversationMessageWithIdOnly = await prisma.conversationMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConversationMessageFindManyArgs>(args?: SelectSubset<T, ConversationMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConversationMessage.
     * @param {ConversationMessageCreateArgs} args - Arguments to create a ConversationMessage.
     * @example
     * // Create one ConversationMessage
     * const ConversationMessage = await prisma.conversationMessage.create({
     *   data: {
     *     // ... data to create a ConversationMessage
     *   }
     * })
     * 
     */
    create<T extends ConversationMessageCreateArgs>(args: SelectSubset<T, ConversationMessageCreateArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConversationMessages.
     * @param {ConversationMessageCreateManyArgs} args - Arguments to create many ConversationMessages.
     * @example
     * // Create many ConversationMessages
     * const conversationMessage = await prisma.conversationMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConversationMessageCreateManyArgs>(args?: SelectSubset<T, ConversationMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConversationMessages and returns the data saved in the database.
     * @param {ConversationMessageCreateManyAndReturnArgs} args - Arguments to create many ConversationMessages.
     * @example
     * // Create many ConversationMessages
     * const conversationMessage = await prisma.conversationMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConversationMessages and only return the `id`
     * const conversationMessageWithIdOnly = await prisma.conversationMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConversationMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ConversationMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ConversationMessage.
     * @param {ConversationMessageDeleteArgs} args - Arguments to delete one ConversationMessage.
     * @example
     * // Delete one ConversationMessage
     * const ConversationMessage = await prisma.conversationMessage.delete({
     *   where: {
     *     // ... filter to delete one ConversationMessage
     *   }
     * })
     * 
     */
    delete<T extends ConversationMessageDeleteArgs>(args: SelectSubset<T, ConversationMessageDeleteArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConversationMessage.
     * @param {ConversationMessageUpdateArgs} args - Arguments to update one ConversationMessage.
     * @example
     * // Update one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConversationMessageUpdateArgs>(args: SelectSubset<T, ConversationMessageUpdateArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConversationMessages.
     * @param {ConversationMessageDeleteManyArgs} args - Arguments to filter ConversationMessages to delete.
     * @example
     * // Delete a few ConversationMessages
     * const { count } = await prisma.conversationMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConversationMessageDeleteManyArgs>(args?: SelectSubset<T, ConversationMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConversationMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConversationMessages
     * const conversationMessage = await prisma.conversationMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConversationMessageUpdateManyArgs>(args: SelectSubset<T, ConversationMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConversationMessages and returns the data updated in the database.
     * @param {ConversationMessageUpdateManyAndReturnArgs} args - Arguments to update many ConversationMessages.
     * @example
     * // Update many ConversationMessages
     * const conversationMessage = await prisma.conversationMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ConversationMessages and only return the `id`
     * const conversationMessageWithIdOnly = await prisma.conversationMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConversationMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ConversationMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ConversationMessage.
     * @param {ConversationMessageUpsertArgs} args - Arguments to update or create a ConversationMessage.
     * @example
     * // Update or create a ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.upsert({
     *   create: {
     *     // ... data to create a ConversationMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConversationMessage we want to update
     *   }
     * })
     */
    upsert<T extends ConversationMessageUpsertArgs>(args: SelectSubset<T, ConversationMessageUpsertArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConversationMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageCountArgs} args - Arguments to filter ConversationMessages to count.
     * @example
     * // Count the number of ConversationMessages
     * const count = await prisma.conversationMessage.count({
     *   where: {
     *     // ... the filter for the ConversationMessages we want to count
     *   }
     * })
    **/
    count<T extends ConversationMessageCountArgs>(
      args?: Subset<T, ConversationMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConversationMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConversationMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConversationMessageAggregateArgs>(args: Subset<T, ConversationMessageAggregateArgs>): Prisma.PrismaPromise<GetConversationMessageAggregateType<T>>

    /**
     * Group by ConversationMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConversationMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConversationMessageGroupByArgs['orderBy'] }
        : { orderBy?: ConversationMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConversationMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConversationMessage model
   */
  readonly fields: ConversationMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConversationMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConversationMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConversationMessage model
   */
  interface ConversationMessageFieldRefs {
    readonly id: FieldRef<"ConversationMessage", 'Int'>
    readonly messageId: FieldRef<"ConversationMessage", 'Int'>
    readonly conversationId: FieldRef<"ConversationMessage", 'Int'>
    readonly inboxId: FieldRef<"ConversationMessage", 'Int'>
    readonly conversationKey: FieldRef<"ConversationMessage", 'String'>
    readonly sender: FieldRef<"ConversationMessage", 'String'>
    readonly content: FieldRef<"ConversationMessage", 'String'>
    readonly createdAt: FieldRef<"ConversationMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConversationMessage findUnique
   */
  export type ConversationMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Filter, which ConversationMessage to fetch.
     */
    where: ConversationMessageWhereUniqueInput
  }

  /**
   * ConversationMessage findUniqueOrThrow
   */
  export type ConversationMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Filter, which ConversationMessage to fetch.
     */
    where: ConversationMessageWhereUniqueInput
  }

  /**
   * ConversationMessage findFirst
   */
  export type ConversationMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Filter, which ConversationMessage to fetch.
     */
    where?: ConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationMessages to fetch.
     */
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConversationMessages.
     */
    cursor?: ConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConversationMessages.
     */
    distinct?: ConversationMessageScalarFieldEnum | ConversationMessageScalarFieldEnum[]
  }

  /**
   * ConversationMessage findFirstOrThrow
   */
  export type ConversationMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Filter, which ConversationMessage to fetch.
     */
    where?: ConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationMessages to fetch.
     */
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConversationMessages.
     */
    cursor?: ConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConversationMessages.
     */
    distinct?: ConversationMessageScalarFieldEnum | ConversationMessageScalarFieldEnum[]
  }

  /**
   * ConversationMessage findMany
   */
  export type ConversationMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Filter, which ConversationMessages to fetch.
     */
    where?: ConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationMessages to fetch.
     */
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConversationMessages.
     */
    cursor?: ConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationMessages.
     */
    skip?: number
    distinct?: ConversationMessageScalarFieldEnum | ConversationMessageScalarFieldEnum[]
  }

  /**
   * ConversationMessage create
   */
  export type ConversationMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * The data needed to create a ConversationMessage.
     */
    data: XOR<ConversationMessageCreateInput, ConversationMessageUncheckedCreateInput>
  }

  /**
   * ConversationMessage createMany
   */
  export type ConversationMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConversationMessages.
     */
    data: ConversationMessageCreateManyInput | ConversationMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConversationMessage createManyAndReturn
   */
  export type ConversationMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ConversationMessages.
     */
    data: ConversationMessageCreateManyInput | ConversationMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConversationMessage update
   */
  export type ConversationMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * The data needed to update a ConversationMessage.
     */
    data: XOR<ConversationMessageUpdateInput, ConversationMessageUncheckedUpdateInput>
    /**
     * Choose, which ConversationMessage to update.
     */
    where: ConversationMessageWhereUniqueInput
  }

  /**
   * ConversationMessage updateMany
   */
  export type ConversationMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConversationMessages.
     */
    data: XOR<ConversationMessageUpdateManyMutationInput, ConversationMessageUncheckedUpdateManyInput>
    /**
     * Filter which ConversationMessages to update
     */
    where?: ConversationMessageWhereInput
    /**
     * Limit how many ConversationMessages to update.
     */
    limit?: number
  }

  /**
   * ConversationMessage updateManyAndReturn
   */
  export type ConversationMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * The data used to update ConversationMessages.
     */
    data: XOR<ConversationMessageUpdateManyMutationInput, ConversationMessageUncheckedUpdateManyInput>
    /**
     * Filter which ConversationMessages to update
     */
    where?: ConversationMessageWhereInput
    /**
     * Limit how many ConversationMessages to update.
     */
    limit?: number
  }

  /**
   * ConversationMessage upsert
   */
  export type ConversationMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * The filter to search for the ConversationMessage to update in case it exists.
     */
    where: ConversationMessageWhereUniqueInput
    /**
     * In case the ConversationMessage found by the `where` argument doesn't exist, create a new ConversationMessage with this data.
     */
    create: XOR<ConversationMessageCreateInput, ConversationMessageUncheckedCreateInput>
    /**
     * In case the ConversationMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConversationMessageUpdateInput, ConversationMessageUncheckedUpdateInput>
  }

  /**
   * ConversationMessage delete
   */
  export type ConversationMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Filter which ConversationMessage to delete.
     */
    where: ConversationMessageWhereUniqueInput
  }

  /**
   * ConversationMessage deleteMany
   */
  export type ConversationMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConversationMessages to delete
     */
    where?: ConversationMessageWhereInput
    /**
     * Limit how many ConversationMessages to delete.
     */
    limit?: number
  }

  /**
   * ConversationMessage without action
   */
  export type ConversationMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
  }


  /**
   * Model AgentAssignment
   */

  export type AggregateAgentAssignment = {
    _count: AgentAssignmentCountAggregateOutputType | null
    _avg: AgentAssignmentAvgAggregateOutputType | null
    _sum: AgentAssignmentSumAggregateOutputType | null
    _min: AgentAssignmentMinAggregateOutputType | null
    _max: AgentAssignmentMaxAggregateOutputType | null
  }

  export type AgentAssignmentAvgAggregateOutputType = {
    inboxId: number | null
    agentId: number | null
    activeConversationId: number | null
  }

  export type AgentAssignmentSumAggregateOutputType = {
    inboxId: number | null
    agentId: number | null
    activeConversationId: number | null
  }

  export type AgentAssignmentMinAggregateOutputType = {
    inboxId: number | null
    agentId: number | null
    lastAssignedAt: Date | null
    activeConversationId: number | null
    availabilityBeforeBusy: $Enums.AgentAvailability | null
  }

  export type AgentAssignmentMaxAggregateOutputType = {
    inboxId: number | null
    agentId: number | null
    lastAssignedAt: Date | null
    activeConversationId: number | null
    availabilityBeforeBusy: $Enums.AgentAvailability | null
  }

  export type AgentAssignmentCountAggregateOutputType = {
    inboxId: number
    agentId: number
    lastAssignedAt: number
    activeConversationId: number
    availabilityBeforeBusy: number
    _all: number
  }


  export type AgentAssignmentAvgAggregateInputType = {
    inboxId?: true
    agentId?: true
    activeConversationId?: true
  }

  export type AgentAssignmentSumAggregateInputType = {
    inboxId?: true
    agentId?: true
    activeConversationId?: true
  }

  export type AgentAssignmentMinAggregateInputType = {
    inboxId?: true
    agentId?: true
    lastAssignedAt?: true
    activeConversationId?: true
    availabilityBeforeBusy?: true
  }

  export type AgentAssignmentMaxAggregateInputType = {
    inboxId?: true
    agentId?: true
    lastAssignedAt?: true
    activeConversationId?: true
    availabilityBeforeBusy?: true
  }

  export type AgentAssignmentCountAggregateInputType = {
    inboxId?: true
    agentId?: true
    lastAssignedAt?: true
    activeConversationId?: true
    availabilityBeforeBusy?: true
    _all?: true
  }

  export type AgentAssignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentAssignment to aggregate.
     */
    where?: AgentAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentAssignments to fetch.
     */
    orderBy?: AgentAssignmentOrderByWithRelationInput | AgentAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentAssignments
    **/
    _count?: true | AgentAssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AgentAssignmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AgentAssignmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentAssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentAssignmentMaxAggregateInputType
  }

  export type GetAgentAssignmentAggregateType<T extends AgentAssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentAssignment[P]>
      : GetScalarType<T[P], AggregateAgentAssignment[P]>
  }




  export type AgentAssignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentAssignmentWhereInput
    orderBy?: AgentAssignmentOrderByWithAggregationInput | AgentAssignmentOrderByWithAggregationInput[]
    by: AgentAssignmentScalarFieldEnum[] | AgentAssignmentScalarFieldEnum
    having?: AgentAssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentAssignmentCountAggregateInputType | true
    _avg?: AgentAssignmentAvgAggregateInputType
    _sum?: AgentAssignmentSumAggregateInputType
    _min?: AgentAssignmentMinAggregateInputType
    _max?: AgentAssignmentMaxAggregateInputType
  }

  export type AgentAssignmentGroupByOutputType = {
    inboxId: number
    agentId: number
    lastAssignedAt: Date | null
    activeConversationId: number | null
    availabilityBeforeBusy: $Enums.AgentAvailability | null
    _count: AgentAssignmentCountAggregateOutputType | null
    _avg: AgentAssignmentAvgAggregateOutputType | null
    _sum: AgentAssignmentSumAggregateOutputType | null
    _min: AgentAssignmentMinAggregateOutputType | null
    _max: AgentAssignmentMaxAggregateOutputType | null
  }

  type GetAgentAssignmentGroupByPayload<T extends AgentAssignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentAssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentAssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentAssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], AgentAssignmentGroupByOutputType[P]>
        }
      >
    >


  export type AgentAssignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    inboxId?: boolean
    agentId?: boolean
    lastAssignedAt?: boolean
    activeConversationId?: boolean
    availabilityBeforeBusy?: boolean
  }, ExtArgs["result"]["agentAssignment"]>

  export type AgentAssignmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    inboxId?: boolean
    agentId?: boolean
    lastAssignedAt?: boolean
    activeConversationId?: boolean
    availabilityBeforeBusy?: boolean
  }, ExtArgs["result"]["agentAssignment"]>

  export type AgentAssignmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    inboxId?: boolean
    agentId?: boolean
    lastAssignedAt?: boolean
    activeConversationId?: boolean
    availabilityBeforeBusy?: boolean
  }, ExtArgs["result"]["agentAssignment"]>

  export type AgentAssignmentSelectScalar = {
    inboxId?: boolean
    agentId?: boolean
    lastAssignedAt?: boolean
    activeConversationId?: boolean
    availabilityBeforeBusy?: boolean
  }

  export type AgentAssignmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"inboxId" | "agentId" | "lastAssignedAt" | "activeConversationId" | "availabilityBeforeBusy", ExtArgs["result"]["agentAssignment"]>

  export type $AgentAssignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentAssignment"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      inboxId: number
      agentId: number
      lastAssignedAt: Date | null
      activeConversationId: number | null
      availabilityBeforeBusy: $Enums.AgentAvailability | null
    }, ExtArgs["result"]["agentAssignment"]>
    composites: {}
  }

  type AgentAssignmentGetPayload<S extends boolean | null | undefined | AgentAssignmentDefaultArgs> = $Result.GetResult<Prisma.$AgentAssignmentPayload, S>

  type AgentAssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentAssignmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentAssignmentCountAggregateInputType | true
    }

  export interface AgentAssignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentAssignment'], meta: { name: 'AgentAssignment' } }
    /**
     * Find zero or one AgentAssignment that matches the filter.
     * @param {AgentAssignmentFindUniqueArgs} args - Arguments to find a AgentAssignment
     * @example
     * // Get one AgentAssignment
     * const agentAssignment = await prisma.agentAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentAssignmentFindUniqueArgs>(args: SelectSubset<T, AgentAssignmentFindUniqueArgs<ExtArgs>>): Prisma__AgentAssignmentClient<$Result.GetResult<Prisma.$AgentAssignmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentAssignment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentAssignmentFindUniqueOrThrowArgs} args - Arguments to find a AgentAssignment
     * @example
     * // Get one AgentAssignment
     * const agentAssignment = await prisma.agentAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentAssignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentAssignmentClient<$Result.GetResult<Prisma.$AgentAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAssignmentFindFirstArgs} args - Arguments to find a AgentAssignment
     * @example
     * // Get one AgentAssignment
     * const agentAssignment = await prisma.agentAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentAssignmentFindFirstArgs>(args?: SelectSubset<T, AgentAssignmentFindFirstArgs<ExtArgs>>): Prisma__AgentAssignmentClient<$Result.GetResult<Prisma.$AgentAssignmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAssignmentFindFirstOrThrowArgs} args - Arguments to find a AgentAssignment
     * @example
     * // Get one AgentAssignment
     * const agentAssignment = await prisma.agentAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentAssignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentAssignmentClient<$Result.GetResult<Prisma.$AgentAssignmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentAssignments
     * const agentAssignments = await prisma.agentAssignment.findMany()
     * 
     * // Get first 10 AgentAssignments
     * const agentAssignments = await prisma.agentAssignment.findMany({ take: 10 })
     * 
     * // Only select the `inboxId`
     * const agentAssignmentWithInboxIdOnly = await prisma.agentAssignment.findMany({ select: { inboxId: true } })
     * 
     */
    findMany<T extends AgentAssignmentFindManyArgs>(args?: SelectSubset<T, AgentAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentAssignment.
     * @param {AgentAssignmentCreateArgs} args - Arguments to create a AgentAssignment.
     * @example
     * // Create one AgentAssignment
     * const AgentAssignment = await prisma.agentAssignment.create({
     *   data: {
     *     // ... data to create a AgentAssignment
     *   }
     * })
     * 
     */
    create<T extends AgentAssignmentCreateArgs>(args: SelectSubset<T, AgentAssignmentCreateArgs<ExtArgs>>): Prisma__AgentAssignmentClient<$Result.GetResult<Prisma.$AgentAssignmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentAssignments.
     * @param {AgentAssignmentCreateManyArgs} args - Arguments to create many AgentAssignments.
     * @example
     * // Create many AgentAssignments
     * const agentAssignment = await prisma.agentAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentAssignmentCreateManyArgs>(args?: SelectSubset<T, AgentAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentAssignments and returns the data saved in the database.
     * @param {AgentAssignmentCreateManyAndReturnArgs} args - Arguments to create many AgentAssignments.
     * @example
     * // Create many AgentAssignments
     * const agentAssignment = await prisma.agentAssignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentAssignments and only return the `inboxId`
     * const agentAssignmentWithInboxIdOnly = await prisma.agentAssignment.createManyAndReturn({
     *   select: { inboxId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentAssignmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentAssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentAssignmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentAssignment.
     * @param {AgentAssignmentDeleteArgs} args - Arguments to delete one AgentAssignment.
     * @example
     * // Delete one AgentAssignment
     * const AgentAssignment = await prisma.agentAssignment.delete({
     *   where: {
     *     // ... filter to delete one AgentAssignment
     *   }
     * })
     * 
     */
    delete<T extends AgentAssignmentDeleteArgs>(args: SelectSubset<T, AgentAssignmentDeleteArgs<ExtArgs>>): Prisma__AgentAssignmentClient<$Result.GetResult<Prisma.$AgentAssignmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentAssignment.
     * @param {AgentAssignmentUpdateArgs} args - Arguments to update one AgentAssignment.
     * @example
     * // Update one AgentAssignment
     * const agentAssignment = await prisma.agentAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentAssignmentUpdateArgs>(args: SelectSubset<T, AgentAssignmentUpdateArgs<ExtArgs>>): Prisma__AgentAssignmentClient<$Result.GetResult<Prisma.$AgentAssignmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentAssignments.
     * @param {AgentAssignmentDeleteManyArgs} args - Arguments to filter AgentAssignments to delete.
     * @example
     * // Delete a few AgentAssignments
     * const { count } = await prisma.agentAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentAssignmentDeleteManyArgs>(args?: SelectSubset<T, AgentAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentAssignments
     * const agentAssignment = await prisma.agentAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentAssignmentUpdateManyArgs>(args: SelectSubset<T, AgentAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentAssignments and returns the data updated in the database.
     * @param {AgentAssignmentUpdateManyAndReturnArgs} args - Arguments to update many AgentAssignments.
     * @example
     * // Update many AgentAssignments
     * const agentAssignment = await prisma.agentAssignment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentAssignments and only return the `inboxId`
     * const agentAssignmentWithInboxIdOnly = await prisma.agentAssignment.updateManyAndReturn({
     *   select: { inboxId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentAssignmentUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentAssignmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentAssignmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentAssignment.
     * @param {AgentAssignmentUpsertArgs} args - Arguments to update or create a AgentAssignment.
     * @example
     * // Update or create a AgentAssignment
     * const agentAssignment = await prisma.agentAssignment.upsert({
     *   create: {
     *     // ... data to create a AgentAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentAssignment we want to update
     *   }
     * })
     */
    upsert<T extends AgentAssignmentUpsertArgs>(args: SelectSubset<T, AgentAssignmentUpsertArgs<ExtArgs>>): Prisma__AgentAssignmentClient<$Result.GetResult<Prisma.$AgentAssignmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAssignmentCountArgs} args - Arguments to filter AgentAssignments to count.
     * @example
     * // Count the number of AgentAssignments
     * const count = await prisma.agentAssignment.count({
     *   where: {
     *     // ... the filter for the AgentAssignments we want to count
     *   }
     * })
    **/
    count<T extends AgentAssignmentCountArgs>(
      args?: Subset<T, AgentAssignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentAssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentAssignmentAggregateArgs>(args: Subset<T, AgentAssignmentAggregateArgs>): Prisma.PrismaPromise<GetAgentAssignmentAggregateType<T>>

    /**
     * Group by AgentAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAssignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentAssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentAssignmentGroupByArgs['orderBy'] }
        : { orderBy?: AgentAssignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentAssignment model
   */
  readonly fields: AgentAssignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentAssignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentAssignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentAssignment model
   */
  interface AgentAssignmentFieldRefs {
    readonly inboxId: FieldRef<"AgentAssignment", 'Int'>
    readonly agentId: FieldRef<"AgentAssignment", 'Int'>
    readonly lastAssignedAt: FieldRef<"AgentAssignment", 'DateTime'>
    readonly activeConversationId: FieldRef<"AgentAssignment", 'Int'>
    readonly availabilityBeforeBusy: FieldRef<"AgentAssignment", 'AgentAvailability'>
  }
    

  // Custom InputTypes
  /**
   * AgentAssignment findUnique
   */
  export type AgentAssignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAssignment
     */
    select?: AgentAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAssignment
     */
    omit?: AgentAssignmentOmit<ExtArgs> | null
    /**
     * Filter, which AgentAssignment to fetch.
     */
    where: AgentAssignmentWhereUniqueInput
  }

  /**
   * AgentAssignment findUniqueOrThrow
   */
  export type AgentAssignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAssignment
     */
    select?: AgentAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAssignment
     */
    omit?: AgentAssignmentOmit<ExtArgs> | null
    /**
     * Filter, which AgentAssignment to fetch.
     */
    where: AgentAssignmentWhereUniqueInput
  }

  /**
   * AgentAssignment findFirst
   */
  export type AgentAssignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAssignment
     */
    select?: AgentAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAssignment
     */
    omit?: AgentAssignmentOmit<ExtArgs> | null
    /**
     * Filter, which AgentAssignment to fetch.
     */
    where?: AgentAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentAssignments to fetch.
     */
    orderBy?: AgentAssignmentOrderByWithRelationInput | AgentAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentAssignments.
     */
    cursor?: AgentAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentAssignments.
     */
    distinct?: AgentAssignmentScalarFieldEnum | AgentAssignmentScalarFieldEnum[]
  }

  /**
   * AgentAssignment findFirstOrThrow
   */
  export type AgentAssignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAssignment
     */
    select?: AgentAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAssignment
     */
    omit?: AgentAssignmentOmit<ExtArgs> | null
    /**
     * Filter, which AgentAssignment to fetch.
     */
    where?: AgentAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentAssignments to fetch.
     */
    orderBy?: AgentAssignmentOrderByWithRelationInput | AgentAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentAssignments.
     */
    cursor?: AgentAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentAssignments.
     */
    distinct?: AgentAssignmentScalarFieldEnum | AgentAssignmentScalarFieldEnum[]
  }

  /**
   * AgentAssignment findMany
   */
  export type AgentAssignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAssignment
     */
    select?: AgentAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAssignment
     */
    omit?: AgentAssignmentOmit<ExtArgs> | null
    /**
     * Filter, which AgentAssignments to fetch.
     */
    where?: AgentAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentAssignments to fetch.
     */
    orderBy?: AgentAssignmentOrderByWithRelationInput | AgentAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentAssignments.
     */
    cursor?: AgentAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentAssignments.
     */
    skip?: number
    distinct?: AgentAssignmentScalarFieldEnum | AgentAssignmentScalarFieldEnum[]
  }

  /**
   * AgentAssignment create
   */
  export type AgentAssignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAssignment
     */
    select?: AgentAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAssignment
     */
    omit?: AgentAssignmentOmit<ExtArgs> | null
    /**
     * The data needed to create a AgentAssignment.
     */
    data: XOR<AgentAssignmentCreateInput, AgentAssignmentUncheckedCreateInput>
  }

  /**
   * AgentAssignment createMany
   */
  export type AgentAssignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentAssignments.
     */
    data: AgentAssignmentCreateManyInput | AgentAssignmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentAssignment createManyAndReturn
   */
  export type AgentAssignmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAssignment
     */
    select?: AgentAssignmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAssignment
     */
    omit?: AgentAssignmentOmit<ExtArgs> | null
    /**
     * The data used to create many AgentAssignments.
     */
    data: AgentAssignmentCreateManyInput | AgentAssignmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentAssignment update
   */
  export type AgentAssignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAssignment
     */
    select?: AgentAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAssignment
     */
    omit?: AgentAssignmentOmit<ExtArgs> | null
    /**
     * The data needed to update a AgentAssignment.
     */
    data: XOR<AgentAssignmentUpdateInput, AgentAssignmentUncheckedUpdateInput>
    /**
     * Choose, which AgentAssignment to update.
     */
    where: AgentAssignmentWhereUniqueInput
  }

  /**
   * AgentAssignment updateMany
   */
  export type AgentAssignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentAssignments.
     */
    data: XOR<AgentAssignmentUpdateManyMutationInput, AgentAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which AgentAssignments to update
     */
    where?: AgentAssignmentWhereInput
    /**
     * Limit how many AgentAssignments to update.
     */
    limit?: number
  }

  /**
   * AgentAssignment updateManyAndReturn
   */
  export type AgentAssignmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAssignment
     */
    select?: AgentAssignmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAssignment
     */
    omit?: AgentAssignmentOmit<ExtArgs> | null
    /**
     * The data used to update AgentAssignments.
     */
    data: XOR<AgentAssignmentUpdateManyMutationInput, AgentAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which AgentAssignments to update
     */
    where?: AgentAssignmentWhereInput
    /**
     * Limit how many AgentAssignments to update.
     */
    limit?: number
  }

  /**
   * AgentAssignment upsert
   */
  export type AgentAssignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAssignment
     */
    select?: AgentAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAssignment
     */
    omit?: AgentAssignmentOmit<ExtArgs> | null
    /**
     * The filter to search for the AgentAssignment to update in case it exists.
     */
    where: AgentAssignmentWhereUniqueInput
    /**
     * In case the AgentAssignment found by the `where` argument doesn't exist, create a new AgentAssignment with this data.
     */
    create: XOR<AgentAssignmentCreateInput, AgentAssignmentUncheckedCreateInput>
    /**
     * In case the AgentAssignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentAssignmentUpdateInput, AgentAssignmentUncheckedUpdateInput>
  }

  /**
   * AgentAssignment delete
   */
  export type AgentAssignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAssignment
     */
    select?: AgentAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAssignment
     */
    omit?: AgentAssignmentOmit<ExtArgs> | null
    /**
     * Filter which AgentAssignment to delete.
     */
    where: AgentAssignmentWhereUniqueInput
  }

  /**
   * AgentAssignment deleteMany
   */
  export type AgentAssignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentAssignments to delete
     */
    where?: AgentAssignmentWhereInput
    /**
     * Limit how many AgentAssignments to delete.
     */
    limit?: number
  }

  /**
   * AgentAssignment without action
   */
  export type AgentAssignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAssignment
     */
    select?: AgentAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAssignment
     */
    omit?: AgentAssignmentOmit<ExtArgs> | null
  }


  /**
   * Model HandoffRequest
   */

  export type AggregateHandoffRequest = {
    _count: HandoffRequestCountAggregateOutputType | null
    _avg: HandoffRequestAvgAggregateOutputType | null
    _sum: HandoffRequestSumAggregateOutputType | null
    _min: HandoffRequestMinAggregateOutputType | null
    _max: HandoffRequestMaxAggregateOutputType | null
  }

  export type HandoffRequestAvgAggregateOutputType = {
    conversationId: number | null
    accountId: number | null
    inboxId: number | null
    agentId: number | null
    lastPositionNotified: number | null
  }

  export type HandoffRequestSumAggregateOutputType = {
    conversationId: number | null
    accountId: number | null
    inboxId: number | null
    agentId: number | null
    lastPositionNotified: number | null
  }

  export type HandoffRequestMinAggregateOutputType = {
    conversationKey: string | null
    conversationId: number | null
    accountId: number | null
    inboxId: number | null
    requestedAt: Date | null
    status: $Enums.HandoffRequestStatus | null
    agentId: number | null
    lastPositionNotified: number | null
  }

  export type HandoffRequestMaxAggregateOutputType = {
    conversationKey: string | null
    conversationId: number | null
    accountId: number | null
    inboxId: number | null
    requestedAt: Date | null
    status: $Enums.HandoffRequestStatus | null
    agentId: number | null
    lastPositionNotified: number | null
  }

  export type HandoffRequestCountAggregateOutputType = {
    conversationKey: number
    conversationId: number
    accountId: number
    inboxId: number
    requestedAt: number
    status: number
    agentId: number
    lastPositionNotified: number
    _all: number
  }


  export type HandoffRequestAvgAggregateInputType = {
    conversationId?: true
    accountId?: true
    inboxId?: true
    agentId?: true
    lastPositionNotified?: true
  }

  export type HandoffRequestSumAggregateInputType = {
    conversationId?: true
    accountId?: true
    inboxId?: true
    agentId?: true
    lastPositionNotified?: true
  }

  export type HandoffRequestMinAggregateInputType = {
    conversationKey?: true
    conversationId?: true
    accountId?: true
    inboxId?: true
    requestedAt?: true
    status?: true
    agentId?: true
    lastPositionNotified?: true
  }

  export type HandoffRequestMaxAggregateInputType = {
    conversationKey?: true
    conversationId?: true
    accountId?: true
    inboxId?: true
    requestedAt?: true
    status?: true
    agentId?: true
    lastPositionNotified?: true
  }

  export type HandoffRequestCountAggregateInputType = {
    conversationKey?: true
    conversationId?: true
    accountId?: true
    inboxId?: true
    requestedAt?: true
    status?: true
    agentId?: true
    lastPositionNotified?: true
    _all?: true
  }

  export type HandoffRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HandoffRequest to aggregate.
     */
    where?: HandoffRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HandoffRequests to fetch.
     */
    orderBy?: HandoffRequestOrderByWithRelationInput | HandoffRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HandoffRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HandoffRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HandoffRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HandoffRequests
    **/
    _count?: true | HandoffRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HandoffRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HandoffRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HandoffRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HandoffRequestMaxAggregateInputType
  }

  export type GetHandoffRequestAggregateType<T extends HandoffRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateHandoffRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHandoffRequest[P]>
      : GetScalarType<T[P], AggregateHandoffRequest[P]>
  }




  export type HandoffRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HandoffRequestWhereInput
    orderBy?: HandoffRequestOrderByWithAggregationInput | HandoffRequestOrderByWithAggregationInput[]
    by: HandoffRequestScalarFieldEnum[] | HandoffRequestScalarFieldEnum
    having?: HandoffRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HandoffRequestCountAggregateInputType | true
    _avg?: HandoffRequestAvgAggregateInputType
    _sum?: HandoffRequestSumAggregateInputType
    _min?: HandoffRequestMinAggregateInputType
    _max?: HandoffRequestMaxAggregateInputType
  }

  export type HandoffRequestGroupByOutputType = {
    conversationKey: string
    conversationId: number
    accountId: number
    inboxId: number
    requestedAt: Date
    status: $Enums.HandoffRequestStatus
    agentId: number | null
    lastPositionNotified: number | null
    _count: HandoffRequestCountAggregateOutputType | null
    _avg: HandoffRequestAvgAggregateOutputType | null
    _sum: HandoffRequestSumAggregateOutputType | null
    _min: HandoffRequestMinAggregateOutputType | null
    _max: HandoffRequestMaxAggregateOutputType | null
  }

  type GetHandoffRequestGroupByPayload<T extends HandoffRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HandoffRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HandoffRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HandoffRequestGroupByOutputType[P]>
            : GetScalarType<T[P], HandoffRequestGroupByOutputType[P]>
        }
      >
    >


  export type HandoffRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    conversationKey?: boolean
    conversationId?: boolean
    accountId?: boolean
    inboxId?: boolean
    requestedAt?: boolean
    status?: boolean
    agentId?: boolean
    lastPositionNotified?: boolean
  }, ExtArgs["result"]["handoffRequest"]>

  export type HandoffRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    conversationKey?: boolean
    conversationId?: boolean
    accountId?: boolean
    inboxId?: boolean
    requestedAt?: boolean
    status?: boolean
    agentId?: boolean
    lastPositionNotified?: boolean
  }, ExtArgs["result"]["handoffRequest"]>

  export type HandoffRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    conversationKey?: boolean
    conversationId?: boolean
    accountId?: boolean
    inboxId?: boolean
    requestedAt?: boolean
    status?: boolean
    agentId?: boolean
    lastPositionNotified?: boolean
  }, ExtArgs["result"]["handoffRequest"]>

  export type HandoffRequestSelectScalar = {
    conversationKey?: boolean
    conversationId?: boolean
    accountId?: boolean
    inboxId?: boolean
    requestedAt?: boolean
    status?: boolean
    agentId?: boolean
    lastPositionNotified?: boolean
  }

  export type HandoffRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"conversationKey" | "conversationId" | "accountId" | "inboxId" | "requestedAt" | "status" | "agentId" | "lastPositionNotified", ExtArgs["result"]["handoffRequest"]>

  export type $HandoffRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HandoffRequest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      conversationKey: string
      conversationId: number
      accountId: number
      inboxId: number
      requestedAt: Date
      status: $Enums.HandoffRequestStatus
      agentId: number | null
      lastPositionNotified: number | null
    }, ExtArgs["result"]["handoffRequest"]>
    composites: {}
  }

  type HandoffRequestGetPayload<S extends boolean | null | undefined | HandoffRequestDefaultArgs> = $Result.GetResult<Prisma.$HandoffRequestPayload, S>

  type HandoffRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HandoffRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HandoffRequestCountAggregateInputType | true
    }

  export interface HandoffRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HandoffRequest'], meta: { name: 'HandoffRequest' } }
    /**
     * Find zero or one HandoffRequest that matches the filter.
     * @param {HandoffRequestFindUniqueArgs} args - Arguments to find a HandoffRequest
     * @example
     * // Get one HandoffRequest
     * const handoffRequest = await prisma.handoffRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HandoffRequestFindUniqueArgs>(args: SelectSubset<T, HandoffRequestFindUniqueArgs<ExtArgs>>): Prisma__HandoffRequestClient<$Result.GetResult<Prisma.$HandoffRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HandoffRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HandoffRequestFindUniqueOrThrowArgs} args - Arguments to find a HandoffRequest
     * @example
     * // Get one HandoffRequest
     * const handoffRequest = await prisma.handoffRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HandoffRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, HandoffRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HandoffRequestClient<$Result.GetResult<Prisma.$HandoffRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HandoffRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HandoffRequestFindFirstArgs} args - Arguments to find a HandoffRequest
     * @example
     * // Get one HandoffRequest
     * const handoffRequest = await prisma.handoffRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HandoffRequestFindFirstArgs>(args?: SelectSubset<T, HandoffRequestFindFirstArgs<ExtArgs>>): Prisma__HandoffRequestClient<$Result.GetResult<Prisma.$HandoffRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HandoffRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HandoffRequestFindFirstOrThrowArgs} args - Arguments to find a HandoffRequest
     * @example
     * // Get one HandoffRequest
     * const handoffRequest = await prisma.handoffRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HandoffRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, HandoffRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__HandoffRequestClient<$Result.GetResult<Prisma.$HandoffRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HandoffRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HandoffRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HandoffRequests
     * const handoffRequests = await prisma.handoffRequest.findMany()
     * 
     * // Get first 10 HandoffRequests
     * const handoffRequests = await prisma.handoffRequest.findMany({ take: 10 })
     * 
     * // Only select the `conversationKey`
     * const handoffRequestWithConversationKeyOnly = await prisma.handoffRequest.findMany({ select: { conversationKey: true } })
     * 
     */
    findMany<T extends HandoffRequestFindManyArgs>(args?: SelectSubset<T, HandoffRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HandoffRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HandoffRequest.
     * @param {HandoffRequestCreateArgs} args - Arguments to create a HandoffRequest.
     * @example
     * // Create one HandoffRequest
     * const HandoffRequest = await prisma.handoffRequest.create({
     *   data: {
     *     // ... data to create a HandoffRequest
     *   }
     * })
     * 
     */
    create<T extends HandoffRequestCreateArgs>(args: SelectSubset<T, HandoffRequestCreateArgs<ExtArgs>>): Prisma__HandoffRequestClient<$Result.GetResult<Prisma.$HandoffRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HandoffRequests.
     * @param {HandoffRequestCreateManyArgs} args - Arguments to create many HandoffRequests.
     * @example
     * // Create many HandoffRequests
     * const handoffRequest = await prisma.handoffRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HandoffRequestCreateManyArgs>(args?: SelectSubset<T, HandoffRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HandoffRequests and returns the data saved in the database.
     * @param {HandoffRequestCreateManyAndReturnArgs} args - Arguments to create many HandoffRequests.
     * @example
     * // Create many HandoffRequests
     * const handoffRequest = await prisma.handoffRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HandoffRequests and only return the `conversationKey`
     * const handoffRequestWithConversationKeyOnly = await prisma.handoffRequest.createManyAndReturn({
     *   select: { conversationKey: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HandoffRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, HandoffRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HandoffRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a HandoffRequest.
     * @param {HandoffRequestDeleteArgs} args - Arguments to delete one HandoffRequest.
     * @example
     * // Delete one HandoffRequest
     * const HandoffRequest = await prisma.handoffRequest.delete({
     *   where: {
     *     // ... filter to delete one HandoffRequest
     *   }
     * })
     * 
     */
    delete<T extends HandoffRequestDeleteArgs>(args: SelectSubset<T, HandoffRequestDeleteArgs<ExtArgs>>): Prisma__HandoffRequestClient<$Result.GetResult<Prisma.$HandoffRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HandoffRequest.
     * @param {HandoffRequestUpdateArgs} args - Arguments to update one HandoffRequest.
     * @example
     * // Update one HandoffRequest
     * const handoffRequest = await prisma.handoffRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HandoffRequestUpdateArgs>(args: SelectSubset<T, HandoffRequestUpdateArgs<ExtArgs>>): Prisma__HandoffRequestClient<$Result.GetResult<Prisma.$HandoffRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HandoffRequests.
     * @param {HandoffRequestDeleteManyArgs} args - Arguments to filter HandoffRequests to delete.
     * @example
     * // Delete a few HandoffRequests
     * const { count } = await prisma.handoffRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HandoffRequestDeleteManyArgs>(args?: SelectSubset<T, HandoffRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HandoffRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HandoffRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HandoffRequests
     * const handoffRequest = await prisma.handoffRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HandoffRequestUpdateManyArgs>(args: SelectSubset<T, HandoffRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HandoffRequests and returns the data updated in the database.
     * @param {HandoffRequestUpdateManyAndReturnArgs} args - Arguments to update many HandoffRequests.
     * @example
     * // Update many HandoffRequests
     * const handoffRequest = await prisma.handoffRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more HandoffRequests and only return the `conversationKey`
     * const handoffRequestWithConversationKeyOnly = await prisma.handoffRequest.updateManyAndReturn({
     *   select: { conversationKey: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HandoffRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, HandoffRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HandoffRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one HandoffRequest.
     * @param {HandoffRequestUpsertArgs} args - Arguments to update or create a HandoffRequest.
     * @example
     * // Update or create a HandoffRequest
     * const handoffRequest = await prisma.handoffRequest.upsert({
     *   create: {
     *     // ... data to create a HandoffRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HandoffRequest we want to update
     *   }
     * })
     */
    upsert<T extends HandoffRequestUpsertArgs>(args: SelectSubset<T, HandoffRequestUpsertArgs<ExtArgs>>): Prisma__HandoffRequestClient<$Result.GetResult<Prisma.$HandoffRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HandoffRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HandoffRequestCountArgs} args - Arguments to filter HandoffRequests to count.
     * @example
     * // Count the number of HandoffRequests
     * const count = await prisma.handoffRequest.count({
     *   where: {
     *     // ... the filter for the HandoffRequests we want to count
     *   }
     * })
    **/
    count<T extends HandoffRequestCountArgs>(
      args?: Subset<T, HandoffRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HandoffRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HandoffRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HandoffRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HandoffRequestAggregateArgs>(args: Subset<T, HandoffRequestAggregateArgs>): Prisma.PrismaPromise<GetHandoffRequestAggregateType<T>>

    /**
     * Group by HandoffRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HandoffRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HandoffRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HandoffRequestGroupByArgs['orderBy'] }
        : { orderBy?: HandoffRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HandoffRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHandoffRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HandoffRequest model
   */
  readonly fields: HandoffRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HandoffRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HandoffRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HandoffRequest model
   */
  interface HandoffRequestFieldRefs {
    readonly conversationKey: FieldRef<"HandoffRequest", 'String'>
    readonly conversationId: FieldRef<"HandoffRequest", 'Int'>
    readonly accountId: FieldRef<"HandoffRequest", 'Int'>
    readonly inboxId: FieldRef<"HandoffRequest", 'Int'>
    readonly requestedAt: FieldRef<"HandoffRequest", 'DateTime'>
    readonly status: FieldRef<"HandoffRequest", 'HandoffRequestStatus'>
    readonly agentId: FieldRef<"HandoffRequest", 'Int'>
    readonly lastPositionNotified: FieldRef<"HandoffRequest", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * HandoffRequest findUnique
   */
  export type HandoffRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HandoffRequest
     */
    select?: HandoffRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HandoffRequest
     */
    omit?: HandoffRequestOmit<ExtArgs> | null
    /**
     * Filter, which HandoffRequest to fetch.
     */
    where: HandoffRequestWhereUniqueInput
  }

  /**
   * HandoffRequest findUniqueOrThrow
   */
  export type HandoffRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HandoffRequest
     */
    select?: HandoffRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HandoffRequest
     */
    omit?: HandoffRequestOmit<ExtArgs> | null
    /**
     * Filter, which HandoffRequest to fetch.
     */
    where: HandoffRequestWhereUniqueInput
  }

  /**
   * HandoffRequest findFirst
   */
  export type HandoffRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HandoffRequest
     */
    select?: HandoffRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HandoffRequest
     */
    omit?: HandoffRequestOmit<ExtArgs> | null
    /**
     * Filter, which HandoffRequest to fetch.
     */
    where?: HandoffRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HandoffRequests to fetch.
     */
    orderBy?: HandoffRequestOrderByWithRelationInput | HandoffRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HandoffRequests.
     */
    cursor?: HandoffRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HandoffRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HandoffRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HandoffRequests.
     */
    distinct?: HandoffRequestScalarFieldEnum | HandoffRequestScalarFieldEnum[]
  }

  /**
   * HandoffRequest findFirstOrThrow
   */
  export type HandoffRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HandoffRequest
     */
    select?: HandoffRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HandoffRequest
     */
    omit?: HandoffRequestOmit<ExtArgs> | null
    /**
     * Filter, which HandoffRequest to fetch.
     */
    where?: HandoffRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HandoffRequests to fetch.
     */
    orderBy?: HandoffRequestOrderByWithRelationInput | HandoffRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HandoffRequests.
     */
    cursor?: HandoffRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HandoffRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HandoffRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HandoffRequests.
     */
    distinct?: HandoffRequestScalarFieldEnum | HandoffRequestScalarFieldEnum[]
  }

  /**
   * HandoffRequest findMany
   */
  export type HandoffRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HandoffRequest
     */
    select?: HandoffRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HandoffRequest
     */
    omit?: HandoffRequestOmit<ExtArgs> | null
    /**
     * Filter, which HandoffRequests to fetch.
     */
    where?: HandoffRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HandoffRequests to fetch.
     */
    orderBy?: HandoffRequestOrderByWithRelationInput | HandoffRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HandoffRequests.
     */
    cursor?: HandoffRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HandoffRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HandoffRequests.
     */
    skip?: number
    distinct?: HandoffRequestScalarFieldEnum | HandoffRequestScalarFieldEnum[]
  }

  /**
   * HandoffRequest create
   */
  export type HandoffRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HandoffRequest
     */
    select?: HandoffRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HandoffRequest
     */
    omit?: HandoffRequestOmit<ExtArgs> | null
    /**
     * The data needed to create a HandoffRequest.
     */
    data: XOR<HandoffRequestCreateInput, HandoffRequestUncheckedCreateInput>
  }

  /**
   * HandoffRequest createMany
   */
  export type HandoffRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HandoffRequests.
     */
    data: HandoffRequestCreateManyInput | HandoffRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HandoffRequest createManyAndReturn
   */
  export type HandoffRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HandoffRequest
     */
    select?: HandoffRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HandoffRequest
     */
    omit?: HandoffRequestOmit<ExtArgs> | null
    /**
     * The data used to create many HandoffRequests.
     */
    data: HandoffRequestCreateManyInput | HandoffRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HandoffRequest update
   */
  export type HandoffRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HandoffRequest
     */
    select?: HandoffRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HandoffRequest
     */
    omit?: HandoffRequestOmit<ExtArgs> | null
    /**
     * The data needed to update a HandoffRequest.
     */
    data: XOR<HandoffRequestUpdateInput, HandoffRequestUncheckedUpdateInput>
    /**
     * Choose, which HandoffRequest to update.
     */
    where: HandoffRequestWhereUniqueInput
  }

  /**
   * HandoffRequest updateMany
   */
  export type HandoffRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HandoffRequests.
     */
    data: XOR<HandoffRequestUpdateManyMutationInput, HandoffRequestUncheckedUpdateManyInput>
    /**
     * Filter which HandoffRequests to update
     */
    where?: HandoffRequestWhereInput
    /**
     * Limit how many HandoffRequests to update.
     */
    limit?: number
  }

  /**
   * HandoffRequest updateManyAndReturn
   */
  export type HandoffRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HandoffRequest
     */
    select?: HandoffRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HandoffRequest
     */
    omit?: HandoffRequestOmit<ExtArgs> | null
    /**
     * The data used to update HandoffRequests.
     */
    data: XOR<HandoffRequestUpdateManyMutationInput, HandoffRequestUncheckedUpdateManyInput>
    /**
     * Filter which HandoffRequests to update
     */
    where?: HandoffRequestWhereInput
    /**
     * Limit how many HandoffRequests to update.
     */
    limit?: number
  }

  /**
   * HandoffRequest upsert
   */
  export type HandoffRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HandoffRequest
     */
    select?: HandoffRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HandoffRequest
     */
    omit?: HandoffRequestOmit<ExtArgs> | null
    /**
     * The filter to search for the HandoffRequest to update in case it exists.
     */
    where: HandoffRequestWhereUniqueInput
    /**
     * In case the HandoffRequest found by the `where` argument doesn't exist, create a new HandoffRequest with this data.
     */
    create: XOR<HandoffRequestCreateInput, HandoffRequestUncheckedCreateInput>
    /**
     * In case the HandoffRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HandoffRequestUpdateInput, HandoffRequestUncheckedUpdateInput>
  }

  /**
   * HandoffRequest delete
   */
  export type HandoffRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HandoffRequest
     */
    select?: HandoffRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HandoffRequest
     */
    omit?: HandoffRequestOmit<ExtArgs> | null
    /**
     * Filter which HandoffRequest to delete.
     */
    where: HandoffRequestWhereUniqueInput
  }

  /**
   * HandoffRequest deleteMany
   */
  export type HandoffRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HandoffRequests to delete
     */
    where?: HandoffRequestWhereInput
    /**
     * Limit how many HandoffRequests to delete.
     */
    limit?: number
  }

  /**
   * HandoffRequest without action
   */
  export type HandoffRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HandoffRequest
     */
    select?: HandoffRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HandoffRequest
     */
    omit?: HandoffRequestOmit<ExtArgs> | null
  }


  /**
   * Model ScrapeJob
   */

  export type AggregateScrapeJob = {
    _count: ScrapeJobCountAggregateOutputType | null
    _avg: ScrapeJobAvgAggregateOutputType | null
    _sum: ScrapeJobSumAggregateOutputType | null
    _min: ScrapeJobMinAggregateOutputType | null
    _max: ScrapeJobMaxAggregateOutputType | null
  }

  export type ScrapeJobAvgAggregateOutputType = {
    progress: number | null
    durationSeconds: number | null
    documentsIngested: number | null
  }

  export type ScrapeJobSumAggregateOutputType = {
    progress: number | null
    durationSeconds: number | null
    documentsIngested: number | null
  }

  export type ScrapeJobMinAggregateOutputType = {
    id: string | null
    script: string | null
    status: $Enums.ScrapeJobStatus | null
    cadence: $Enums.ScrapeJobCadence | null
    autoRunManualWithNext: boolean | null
    paused: boolean | null
    progress: number | null
    startedAt: Date | null
    finishedAt: Date | null
    logPath: string | null
    nextRunAt: Date | null
    durationSeconds: number | null
    documentsIngested: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScrapeJobMaxAggregateOutputType = {
    id: string | null
    script: string | null
    status: $Enums.ScrapeJobStatus | null
    cadence: $Enums.ScrapeJobCadence | null
    autoRunManualWithNext: boolean | null
    paused: boolean | null
    progress: number | null
    startedAt: Date | null
    finishedAt: Date | null
    logPath: string | null
    nextRunAt: Date | null
    durationSeconds: number | null
    documentsIngested: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScrapeJobCountAggregateOutputType = {
    id: number
    script: number
    args: number
    status: number
    cadence: number
    autoRunManualWithNext: number
    paused: number
    progress: number
    startedAt: number
    finishedAt: number
    logPath: number
    nextRunAt: number
    durationSeconds: number
    documentsIngested: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ScrapeJobAvgAggregateInputType = {
    progress?: true
    durationSeconds?: true
    documentsIngested?: true
  }

  export type ScrapeJobSumAggregateInputType = {
    progress?: true
    durationSeconds?: true
    documentsIngested?: true
  }

  export type ScrapeJobMinAggregateInputType = {
    id?: true
    script?: true
    status?: true
    cadence?: true
    autoRunManualWithNext?: true
    paused?: true
    progress?: true
    startedAt?: true
    finishedAt?: true
    logPath?: true
    nextRunAt?: true
    durationSeconds?: true
    documentsIngested?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScrapeJobMaxAggregateInputType = {
    id?: true
    script?: true
    status?: true
    cadence?: true
    autoRunManualWithNext?: true
    paused?: true
    progress?: true
    startedAt?: true
    finishedAt?: true
    logPath?: true
    nextRunAt?: true
    durationSeconds?: true
    documentsIngested?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScrapeJobCountAggregateInputType = {
    id?: true
    script?: true
    args?: true
    status?: true
    cadence?: true
    autoRunManualWithNext?: true
    paused?: true
    progress?: true
    startedAt?: true
    finishedAt?: true
    logPath?: true
    nextRunAt?: true
    durationSeconds?: true
    documentsIngested?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ScrapeJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScrapeJob to aggregate.
     */
    where?: ScrapeJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeJobs to fetch.
     */
    orderBy?: ScrapeJobOrderByWithRelationInput | ScrapeJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScrapeJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScrapeJobs
    **/
    _count?: true | ScrapeJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScrapeJobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScrapeJobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScrapeJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScrapeJobMaxAggregateInputType
  }

  export type GetScrapeJobAggregateType<T extends ScrapeJobAggregateArgs> = {
        [P in keyof T & keyof AggregateScrapeJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScrapeJob[P]>
      : GetScalarType<T[P], AggregateScrapeJob[P]>
  }




  export type ScrapeJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScrapeJobWhereInput
    orderBy?: ScrapeJobOrderByWithAggregationInput | ScrapeJobOrderByWithAggregationInput[]
    by: ScrapeJobScalarFieldEnum[] | ScrapeJobScalarFieldEnum
    having?: ScrapeJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScrapeJobCountAggregateInputType | true
    _avg?: ScrapeJobAvgAggregateInputType
    _sum?: ScrapeJobSumAggregateInputType
    _min?: ScrapeJobMinAggregateInputType
    _max?: ScrapeJobMaxAggregateInputType
  }

  export type ScrapeJobGroupByOutputType = {
    id: string
    script: string
    args: JsonValue | null
    status: $Enums.ScrapeJobStatus
    cadence: $Enums.ScrapeJobCadence
    autoRunManualWithNext: boolean
    paused: boolean
    progress: number
    startedAt: Date | null
    finishedAt: Date | null
    logPath: string | null
    nextRunAt: Date | null
    durationSeconds: number | null
    documentsIngested: number | null
    createdAt: Date
    updatedAt: Date
    _count: ScrapeJobCountAggregateOutputType | null
    _avg: ScrapeJobAvgAggregateOutputType | null
    _sum: ScrapeJobSumAggregateOutputType | null
    _min: ScrapeJobMinAggregateOutputType | null
    _max: ScrapeJobMaxAggregateOutputType | null
  }

  type GetScrapeJobGroupByPayload<T extends ScrapeJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScrapeJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScrapeJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScrapeJobGroupByOutputType[P]>
            : GetScalarType<T[P], ScrapeJobGroupByOutputType[P]>
        }
      >
    >


  export type ScrapeJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    script?: boolean
    args?: boolean
    status?: boolean
    cadence?: boolean
    autoRunManualWithNext?: boolean
    paused?: boolean
    progress?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    logPath?: boolean
    nextRunAt?: boolean
    durationSeconds?: boolean
    documentsIngested?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["scrapeJob"]>

  export type ScrapeJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    script?: boolean
    args?: boolean
    status?: boolean
    cadence?: boolean
    autoRunManualWithNext?: boolean
    paused?: boolean
    progress?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    logPath?: boolean
    nextRunAt?: boolean
    durationSeconds?: boolean
    documentsIngested?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["scrapeJob"]>

  export type ScrapeJobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    script?: boolean
    args?: boolean
    status?: boolean
    cadence?: boolean
    autoRunManualWithNext?: boolean
    paused?: boolean
    progress?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    logPath?: boolean
    nextRunAt?: boolean
    durationSeconds?: boolean
    documentsIngested?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["scrapeJob"]>

  export type ScrapeJobSelectScalar = {
    id?: boolean
    script?: boolean
    args?: boolean
    status?: boolean
    cadence?: boolean
    autoRunManualWithNext?: boolean
    paused?: boolean
    progress?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    logPath?: boolean
    nextRunAt?: boolean
    durationSeconds?: boolean
    documentsIngested?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ScrapeJobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "script" | "args" | "status" | "cadence" | "autoRunManualWithNext" | "paused" | "progress" | "startedAt" | "finishedAt" | "logPath" | "nextRunAt" | "durationSeconds" | "documentsIngested" | "createdAt" | "updatedAt", ExtArgs["result"]["scrapeJob"]>

  export type $ScrapeJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ScrapeJob"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      script: string
      args: Prisma.JsonValue | null
      status: $Enums.ScrapeJobStatus
      cadence: $Enums.ScrapeJobCadence
      autoRunManualWithNext: boolean
      paused: boolean
      progress: number
      startedAt: Date | null
      finishedAt: Date | null
      logPath: string | null
      nextRunAt: Date | null
      durationSeconds: number | null
      documentsIngested: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["scrapeJob"]>
    composites: {}
  }

  type ScrapeJobGetPayload<S extends boolean | null | undefined | ScrapeJobDefaultArgs> = $Result.GetResult<Prisma.$ScrapeJobPayload, S>

  type ScrapeJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScrapeJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScrapeJobCountAggregateInputType | true
    }

  export interface ScrapeJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ScrapeJob'], meta: { name: 'ScrapeJob' } }
    /**
     * Find zero or one ScrapeJob that matches the filter.
     * @param {ScrapeJobFindUniqueArgs} args - Arguments to find a ScrapeJob
     * @example
     * // Get one ScrapeJob
     * const scrapeJob = await prisma.scrapeJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScrapeJobFindUniqueArgs>(args: SelectSubset<T, ScrapeJobFindUniqueArgs<ExtArgs>>): Prisma__ScrapeJobClient<$Result.GetResult<Prisma.$ScrapeJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ScrapeJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScrapeJobFindUniqueOrThrowArgs} args - Arguments to find a ScrapeJob
     * @example
     * // Get one ScrapeJob
     * const scrapeJob = await prisma.scrapeJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScrapeJobFindUniqueOrThrowArgs>(args: SelectSubset<T, ScrapeJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScrapeJobClient<$Result.GetResult<Prisma.$ScrapeJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScrapeJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeJobFindFirstArgs} args - Arguments to find a ScrapeJob
     * @example
     * // Get one ScrapeJob
     * const scrapeJob = await prisma.scrapeJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScrapeJobFindFirstArgs>(args?: SelectSubset<T, ScrapeJobFindFirstArgs<ExtArgs>>): Prisma__ScrapeJobClient<$Result.GetResult<Prisma.$ScrapeJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScrapeJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeJobFindFirstOrThrowArgs} args - Arguments to find a ScrapeJob
     * @example
     * // Get one ScrapeJob
     * const scrapeJob = await prisma.scrapeJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScrapeJobFindFirstOrThrowArgs>(args?: SelectSubset<T, ScrapeJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScrapeJobClient<$Result.GetResult<Prisma.$ScrapeJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ScrapeJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScrapeJobs
     * const scrapeJobs = await prisma.scrapeJob.findMany()
     * 
     * // Get first 10 ScrapeJobs
     * const scrapeJobs = await prisma.scrapeJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scrapeJobWithIdOnly = await prisma.scrapeJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScrapeJobFindManyArgs>(args?: SelectSubset<T, ScrapeJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ScrapeJob.
     * @param {ScrapeJobCreateArgs} args - Arguments to create a ScrapeJob.
     * @example
     * // Create one ScrapeJob
     * const ScrapeJob = await prisma.scrapeJob.create({
     *   data: {
     *     // ... data to create a ScrapeJob
     *   }
     * })
     * 
     */
    create<T extends ScrapeJobCreateArgs>(args: SelectSubset<T, ScrapeJobCreateArgs<ExtArgs>>): Prisma__ScrapeJobClient<$Result.GetResult<Prisma.$ScrapeJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ScrapeJobs.
     * @param {ScrapeJobCreateManyArgs} args - Arguments to create many ScrapeJobs.
     * @example
     * // Create many ScrapeJobs
     * const scrapeJob = await prisma.scrapeJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScrapeJobCreateManyArgs>(args?: SelectSubset<T, ScrapeJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ScrapeJobs and returns the data saved in the database.
     * @param {ScrapeJobCreateManyAndReturnArgs} args - Arguments to create many ScrapeJobs.
     * @example
     * // Create many ScrapeJobs
     * const scrapeJob = await prisma.scrapeJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ScrapeJobs and only return the `id`
     * const scrapeJobWithIdOnly = await prisma.scrapeJob.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScrapeJobCreateManyAndReturnArgs>(args?: SelectSubset<T, ScrapeJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeJobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ScrapeJob.
     * @param {ScrapeJobDeleteArgs} args - Arguments to delete one ScrapeJob.
     * @example
     * // Delete one ScrapeJob
     * const ScrapeJob = await prisma.scrapeJob.delete({
     *   where: {
     *     // ... filter to delete one ScrapeJob
     *   }
     * })
     * 
     */
    delete<T extends ScrapeJobDeleteArgs>(args: SelectSubset<T, ScrapeJobDeleteArgs<ExtArgs>>): Prisma__ScrapeJobClient<$Result.GetResult<Prisma.$ScrapeJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ScrapeJob.
     * @param {ScrapeJobUpdateArgs} args - Arguments to update one ScrapeJob.
     * @example
     * // Update one ScrapeJob
     * const scrapeJob = await prisma.scrapeJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScrapeJobUpdateArgs>(args: SelectSubset<T, ScrapeJobUpdateArgs<ExtArgs>>): Prisma__ScrapeJobClient<$Result.GetResult<Prisma.$ScrapeJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ScrapeJobs.
     * @param {ScrapeJobDeleteManyArgs} args - Arguments to filter ScrapeJobs to delete.
     * @example
     * // Delete a few ScrapeJobs
     * const { count } = await prisma.scrapeJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScrapeJobDeleteManyArgs>(args?: SelectSubset<T, ScrapeJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScrapeJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScrapeJobs
     * const scrapeJob = await prisma.scrapeJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScrapeJobUpdateManyArgs>(args: SelectSubset<T, ScrapeJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScrapeJobs and returns the data updated in the database.
     * @param {ScrapeJobUpdateManyAndReturnArgs} args - Arguments to update many ScrapeJobs.
     * @example
     * // Update many ScrapeJobs
     * const scrapeJob = await prisma.scrapeJob.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ScrapeJobs and only return the `id`
     * const scrapeJobWithIdOnly = await prisma.scrapeJob.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ScrapeJobUpdateManyAndReturnArgs>(args: SelectSubset<T, ScrapeJobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScrapeJobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ScrapeJob.
     * @param {ScrapeJobUpsertArgs} args - Arguments to update or create a ScrapeJob.
     * @example
     * // Update or create a ScrapeJob
     * const scrapeJob = await prisma.scrapeJob.upsert({
     *   create: {
     *     // ... data to create a ScrapeJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScrapeJob we want to update
     *   }
     * })
     */
    upsert<T extends ScrapeJobUpsertArgs>(args: SelectSubset<T, ScrapeJobUpsertArgs<ExtArgs>>): Prisma__ScrapeJobClient<$Result.GetResult<Prisma.$ScrapeJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ScrapeJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeJobCountArgs} args - Arguments to filter ScrapeJobs to count.
     * @example
     * // Count the number of ScrapeJobs
     * const count = await prisma.scrapeJob.count({
     *   where: {
     *     // ... the filter for the ScrapeJobs we want to count
     *   }
     * })
    **/
    count<T extends ScrapeJobCountArgs>(
      args?: Subset<T, ScrapeJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScrapeJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScrapeJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScrapeJobAggregateArgs>(args: Subset<T, ScrapeJobAggregateArgs>): Prisma.PrismaPromise<GetScrapeJobAggregateType<T>>

    /**
     * Group by ScrapeJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScrapeJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScrapeJobGroupByArgs['orderBy'] }
        : { orderBy?: ScrapeJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScrapeJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScrapeJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ScrapeJob model
   */
  readonly fields: ScrapeJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScrapeJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScrapeJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ScrapeJob model
   */
  interface ScrapeJobFieldRefs {
    readonly id: FieldRef<"ScrapeJob", 'String'>
    readonly script: FieldRef<"ScrapeJob", 'String'>
    readonly args: FieldRef<"ScrapeJob", 'Json'>
    readonly status: FieldRef<"ScrapeJob", 'ScrapeJobStatus'>
    readonly cadence: FieldRef<"ScrapeJob", 'ScrapeJobCadence'>
    readonly autoRunManualWithNext: FieldRef<"ScrapeJob", 'Boolean'>
    readonly paused: FieldRef<"ScrapeJob", 'Boolean'>
    readonly progress: FieldRef<"ScrapeJob", 'Int'>
    readonly startedAt: FieldRef<"ScrapeJob", 'DateTime'>
    readonly finishedAt: FieldRef<"ScrapeJob", 'DateTime'>
    readonly logPath: FieldRef<"ScrapeJob", 'String'>
    readonly nextRunAt: FieldRef<"ScrapeJob", 'DateTime'>
    readonly durationSeconds: FieldRef<"ScrapeJob", 'Float'>
    readonly documentsIngested: FieldRef<"ScrapeJob", 'Int'>
    readonly createdAt: FieldRef<"ScrapeJob", 'DateTime'>
    readonly updatedAt: FieldRef<"ScrapeJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ScrapeJob findUnique
   */
  export type ScrapeJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeJob
     */
    select?: ScrapeJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeJob
     */
    omit?: ScrapeJobOmit<ExtArgs> | null
    /**
     * Filter, which ScrapeJob to fetch.
     */
    where: ScrapeJobWhereUniqueInput
  }

  /**
   * ScrapeJob findUniqueOrThrow
   */
  export type ScrapeJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeJob
     */
    select?: ScrapeJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeJob
     */
    omit?: ScrapeJobOmit<ExtArgs> | null
    /**
     * Filter, which ScrapeJob to fetch.
     */
    where: ScrapeJobWhereUniqueInput
  }

  /**
   * ScrapeJob findFirst
   */
  export type ScrapeJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeJob
     */
    select?: ScrapeJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeJob
     */
    omit?: ScrapeJobOmit<ExtArgs> | null
    /**
     * Filter, which ScrapeJob to fetch.
     */
    where?: ScrapeJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeJobs to fetch.
     */
    orderBy?: ScrapeJobOrderByWithRelationInput | ScrapeJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScrapeJobs.
     */
    cursor?: ScrapeJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScrapeJobs.
     */
    distinct?: ScrapeJobScalarFieldEnum | ScrapeJobScalarFieldEnum[]
  }

  /**
   * ScrapeJob findFirstOrThrow
   */
  export type ScrapeJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeJob
     */
    select?: ScrapeJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeJob
     */
    omit?: ScrapeJobOmit<ExtArgs> | null
    /**
     * Filter, which ScrapeJob to fetch.
     */
    where?: ScrapeJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeJobs to fetch.
     */
    orderBy?: ScrapeJobOrderByWithRelationInput | ScrapeJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScrapeJobs.
     */
    cursor?: ScrapeJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScrapeJobs.
     */
    distinct?: ScrapeJobScalarFieldEnum | ScrapeJobScalarFieldEnum[]
  }

  /**
   * ScrapeJob findMany
   */
  export type ScrapeJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeJob
     */
    select?: ScrapeJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeJob
     */
    omit?: ScrapeJobOmit<ExtArgs> | null
    /**
     * Filter, which ScrapeJobs to fetch.
     */
    where?: ScrapeJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScrapeJobs to fetch.
     */
    orderBy?: ScrapeJobOrderByWithRelationInput | ScrapeJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScrapeJobs.
     */
    cursor?: ScrapeJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScrapeJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScrapeJobs.
     */
    skip?: number
    distinct?: ScrapeJobScalarFieldEnum | ScrapeJobScalarFieldEnum[]
  }

  /**
   * ScrapeJob create
   */
  export type ScrapeJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeJob
     */
    select?: ScrapeJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeJob
     */
    omit?: ScrapeJobOmit<ExtArgs> | null
    /**
     * The data needed to create a ScrapeJob.
     */
    data: XOR<ScrapeJobCreateInput, ScrapeJobUncheckedCreateInput>
  }

  /**
   * ScrapeJob createMany
   */
  export type ScrapeJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScrapeJobs.
     */
    data: ScrapeJobCreateManyInput | ScrapeJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ScrapeJob createManyAndReturn
   */
  export type ScrapeJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeJob
     */
    select?: ScrapeJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeJob
     */
    omit?: ScrapeJobOmit<ExtArgs> | null
    /**
     * The data used to create many ScrapeJobs.
     */
    data: ScrapeJobCreateManyInput | ScrapeJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ScrapeJob update
   */
  export type ScrapeJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeJob
     */
    select?: ScrapeJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeJob
     */
    omit?: ScrapeJobOmit<ExtArgs> | null
    /**
     * The data needed to update a ScrapeJob.
     */
    data: XOR<ScrapeJobUpdateInput, ScrapeJobUncheckedUpdateInput>
    /**
     * Choose, which ScrapeJob to update.
     */
    where: ScrapeJobWhereUniqueInput
  }

  /**
   * ScrapeJob updateMany
   */
  export type ScrapeJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ScrapeJobs.
     */
    data: XOR<ScrapeJobUpdateManyMutationInput, ScrapeJobUncheckedUpdateManyInput>
    /**
     * Filter which ScrapeJobs to update
     */
    where?: ScrapeJobWhereInput
    /**
     * Limit how many ScrapeJobs to update.
     */
    limit?: number
  }

  /**
   * ScrapeJob updateManyAndReturn
   */
  export type ScrapeJobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeJob
     */
    select?: ScrapeJobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeJob
     */
    omit?: ScrapeJobOmit<ExtArgs> | null
    /**
     * The data used to update ScrapeJobs.
     */
    data: XOR<ScrapeJobUpdateManyMutationInput, ScrapeJobUncheckedUpdateManyInput>
    /**
     * Filter which ScrapeJobs to update
     */
    where?: ScrapeJobWhereInput
    /**
     * Limit how many ScrapeJobs to update.
     */
    limit?: number
  }

  /**
   * ScrapeJob upsert
   */
  export type ScrapeJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeJob
     */
    select?: ScrapeJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeJob
     */
    omit?: ScrapeJobOmit<ExtArgs> | null
    /**
     * The filter to search for the ScrapeJob to update in case it exists.
     */
    where: ScrapeJobWhereUniqueInput
    /**
     * In case the ScrapeJob found by the `where` argument doesn't exist, create a new ScrapeJob with this data.
     */
    create: XOR<ScrapeJobCreateInput, ScrapeJobUncheckedCreateInput>
    /**
     * In case the ScrapeJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScrapeJobUpdateInput, ScrapeJobUncheckedUpdateInput>
  }

  /**
   * ScrapeJob delete
   */
  export type ScrapeJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeJob
     */
    select?: ScrapeJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeJob
     */
    omit?: ScrapeJobOmit<ExtArgs> | null
    /**
     * Filter which ScrapeJob to delete.
     */
    where: ScrapeJobWhereUniqueInput
  }

  /**
   * ScrapeJob deleteMany
   */
  export type ScrapeJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScrapeJobs to delete
     */
    where?: ScrapeJobWhereInput
    /**
     * Limit how many ScrapeJobs to delete.
     */
    limit?: number
  }

  /**
   * ScrapeJob without action
   */
  export type ScrapeJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeJob
     */
    select?: ScrapeJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScrapeJob
     */
    omit?: ScrapeJobOmit<ExtArgs> | null
  }


  /**
   * Model AgentAccount
   */

  export type AggregateAgentAccount = {
    _count: AgentAccountCountAggregateOutputType | null
    _min: AgentAccountMinAggregateOutputType | null
    _max: AgentAccountMaxAggregateOutputType | null
  }

  export type AgentAccountMinAggregateOutputType = {
    userId: string | null
    hashedPin: string | null
    telegramChatId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgentAccountMaxAggregateOutputType = {
    userId: string | null
    hashedPin: string | null
    telegramChatId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgentAccountCountAggregateOutputType = {
    userId: number
    hashedPin: number
    telegramChatId: number
    roles: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AgentAccountMinAggregateInputType = {
    userId?: true
    hashedPin?: true
    telegramChatId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgentAccountMaxAggregateInputType = {
    userId?: true
    hashedPin?: true
    telegramChatId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgentAccountCountAggregateInputType = {
    userId?: true
    hashedPin?: true
    telegramChatId?: true
    roles?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AgentAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentAccount to aggregate.
     */
    where?: AgentAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentAccounts to fetch.
     */
    orderBy?: AgentAccountOrderByWithRelationInput | AgentAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentAccounts
    **/
    _count?: true | AgentAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentAccountMaxAggregateInputType
  }

  export type GetAgentAccountAggregateType<T extends AgentAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentAccount[P]>
      : GetScalarType<T[P], AggregateAgentAccount[P]>
  }




  export type AgentAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentAccountWhereInput
    orderBy?: AgentAccountOrderByWithAggregationInput | AgentAccountOrderByWithAggregationInput[]
    by: AgentAccountScalarFieldEnum[] | AgentAccountScalarFieldEnum
    having?: AgentAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentAccountCountAggregateInputType | true
    _min?: AgentAccountMinAggregateInputType
    _max?: AgentAccountMaxAggregateInputType
  }

  export type AgentAccountGroupByOutputType = {
    userId: string
    hashedPin: string
    telegramChatId: string | null
    roles: $Enums.AgentRole[]
    createdAt: Date
    updatedAt: Date
    _count: AgentAccountCountAggregateOutputType | null
    _min: AgentAccountMinAggregateOutputType | null
    _max: AgentAccountMaxAggregateOutputType | null
  }

  type GetAgentAccountGroupByPayload<T extends AgentAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentAccountGroupByOutputType[P]>
            : GetScalarType<T[P], AgentAccountGroupByOutputType[P]>
        }
      >
    >


  export type AgentAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    hashedPin?: boolean
    telegramChatId?: boolean
    roles?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    loginTokens?: boolean | AgentAccount$loginTokensArgs<ExtArgs>
    audits?: boolean | AgentAccount$auditsArgs<ExtArgs>
    _count?: boolean | AgentAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentAccount"]>

  export type AgentAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    hashedPin?: boolean
    telegramChatId?: boolean
    roles?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["agentAccount"]>

  export type AgentAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    hashedPin?: boolean
    telegramChatId?: boolean
    roles?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["agentAccount"]>

  export type AgentAccountSelectScalar = {
    userId?: boolean
    hashedPin?: boolean
    telegramChatId?: boolean
    roles?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AgentAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "hashedPin" | "telegramChatId" | "roles" | "createdAt" | "updatedAt", ExtArgs["result"]["agentAccount"]>
  export type AgentAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loginTokens?: boolean | AgentAccount$loginTokensArgs<ExtArgs>
    audits?: boolean | AgentAccount$auditsArgs<ExtArgs>
    _count?: boolean | AgentAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AgentAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AgentAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AgentAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentAccount"
    objects: {
      loginTokens: Prisma.$LoginTokenPayload<ExtArgs>[]
      audits: Prisma.$LoginAuditPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      hashedPin: string
      telegramChatId: string | null
      roles: $Enums.AgentRole[]
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["agentAccount"]>
    composites: {}
  }

  type AgentAccountGetPayload<S extends boolean | null | undefined | AgentAccountDefaultArgs> = $Result.GetResult<Prisma.$AgentAccountPayload, S>

  type AgentAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentAccountCountAggregateInputType | true
    }

  export interface AgentAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentAccount'], meta: { name: 'AgentAccount' } }
    /**
     * Find zero or one AgentAccount that matches the filter.
     * @param {AgentAccountFindUniqueArgs} args - Arguments to find a AgentAccount
     * @example
     * // Get one AgentAccount
     * const agentAccount = await prisma.agentAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentAccountFindUniqueArgs>(args: SelectSubset<T, AgentAccountFindUniqueArgs<ExtArgs>>): Prisma__AgentAccountClient<$Result.GetResult<Prisma.$AgentAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentAccountFindUniqueOrThrowArgs} args - Arguments to find a AgentAccount
     * @example
     * // Get one AgentAccount
     * const agentAccount = await prisma.agentAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentAccountClient<$Result.GetResult<Prisma.$AgentAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAccountFindFirstArgs} args - Arguments to find a AgentAccount
     * @example
     * // Get one AgentAccount
     * const agentAccount = await prisma.agentAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentAccountFindFirstArgs>(args?: SelectSubset<T, AgentAccountFindFirstArgs<ExtArgs>>): Prisma__AgentAccountClient<$Result.GetResult<Prisma.$AgentAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAccountFindFirstOrThrowArgs} args - Arguments to find a AgentAccount
     * @example
     * // Get one AgentAccount
     * const agentAccount = await prisma.agentAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentAccountClient<$Result.GetResult<Prisma.$AgentAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentAccounts
     * const agentAccounts = await prisma.agentAccount.findMany()
     * 
     * // Get first 10 AgentAccounts
     * const agentAccounts = await prisma.agentAccount.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const agentAccountWithUserIdOnly = await prisma.agentAccount.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends AgentAccountFindManyArgs>(args?: SelectSubset<T, AgentAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentAccount.
     * @param {AgentAccountCreateArgs} args - Arguments to create a AgentAccount.
     * @example
     * // Create one AgentAccount
     * const AgentAccount = await prisma.agentAccount.create({
     *   data: {
     *     // ... data to create a AgentAccount
     *   }
     * })
     * 
     */
    create<T extends AgentAccountCreateArgs>(args: SelectSubset<T, AgentAccountCreateArgs<ExtArgs>>): Prisma__AgentAccountClient<$Result.GetResult<Prisma.$AgentAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentAccounts.
     * @param {AgentAccountCreateManyArgs} args - Arguments to create many AgentAccounts.
     * @example
     * // Create many AgentAccounts
     * const agentAccount = await prisma.agentAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentAccountCreateManyArgs>(args?: SelectSubset<T, AgentAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentAccounts and returns the data saved in the database.
     * @param {AgentAccountCreateManyAndReturnArgs} args - Arguments to create many AgentAccounts.
     * @example
     * // Create many AgentAccounts
     * const agentAccount = await prisma.agentAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentAccounts and only return the `userId`
     * const agentAccountWithUserIdOnly = await prisma.agentAccount.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentAccount.
     * @param {AgentAccountDeleteArgs} args - Arguments to delete one AgentAccount.
     * @example
     * // Delete one AgentAccount
     * const AgentAccount = await prisma.agentAccount.delete({
     *   where: {
     *     // ... filter to delete one AgentAccount
     *   }
     * })
     * 
     */
    delete<T extends AgentAccountDeleteArgs>(args: SelectSubset<T, AgentAccountDeleteArgs<ExtArgs>>): Prisma__AgentAccountClient<$Result.GetResult<Prisma.$AgentAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentAccount.
     * @param {AgentAccountUpdateArgs} args - Arguments to update one AgentAccount.
     * @example
     * // Update one AgentAccount
     * const agentAccount = await prisma.agentAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentAccountUpdateArgs>(args: SelectSubset<T, AgentAccountUpdateArgs<ExtArgs>>): Prisma__AgentAccountClient<$Result.GetResult<Prisma.$AgentAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentAccounts.
     * @param {AgentAccountDeleteManyArgs} args - Arguments to filter AgentAccounts to delete.
     * @example
     * // Delete a few AgentAccounts
     * const { count } = await prisma.agentAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentAccountDeleteManyArgs>(args?: SelectSubset<T, AgentAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentAccounts
     * const agentAccount = await prisma.agentAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentAccountUpdateManyArgs>(args: SelectSubset<T, AgentAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentAccounts and returns the data updated in the database.
     * @param {AgentAccountUpdateManyAndReturnArgs} args - Arguments to update many AgentAccounts.
     * @example
     * // Update many AgentAccounts
     * const agentAccount = await prisma.agentAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentAccounts and only return the `userId`
     * const agentAccountWithUserIdOnly = await prisma.agentAccount.updateManyAndReturn({
     *   select: { userId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentAccount.
     * @param {AgentAccountUpsertArgs} args - Arguments to update or create a AgentAccount.
     * @example
     * // Update or create a AgentAccount
     * const agentAccount = await prisma.agentAccount.upsert({
     *   create: {
     *     // ... data to create a AgentAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentAccount we want to update
     *   }
     * })
     */
    upsert<T extends AgentAccountUpsertArgs>(args: SelectSubset<T, AgentAccountUpsertArgs<ExtArgs>>): Prisma__AgentAccountClient<$Result.GetResult<Prisma.$AgentAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAccountCountArgs} args - Arguments to filter AgentAccounts to count.
     * @example
     * // Count the number of AgentAccounts
     * const count = await prisma.agentAccount.count({
     *   where: {
     *     // ... the filter for the AgentAccounts we want to count
     *   }
     * })
    **/
    count<T extends AgentAccountCountArgs>(
      args?: Subset<T, AgentAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentAccountAggregateArgs>(args: Subset<T, AgentAccountAggregateArgs>): Prisma.PrismaPromise<GetAgentAccountAggregateType<T>>

    /**
     * Group by AgentAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentAccountGroupByArgs['orderBy'] }
        : { orderBy?: AgentAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentAccount model
   */
  readonly fields: AgentAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    loginTokens<T extends AgentAccount$loginTokensArgs<ExtArgs> = {}>(args?: Subset<T, AgentAccount$loginTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    audits<T extends AgentAccount$auditsArgs<ExtArgs> = {}>(args?: Subset<T, AgentAccount$auditsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginAuditPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentAccount model
   */
  interface AgentAccountFieldRefs {
    readonly userId: FieldRef<"AgentAccount", 'String'>
    readonly hashedPin: FieldRef<"AgentAccount", 'String'>
    readonly telegramChatId: FieldRef<"AgentAccount", 'String'>
    readonly roles: FieldRef<"AgentAccount", 'AgentRole[]'>
    readonly createdAt: FieldRef<"AgentAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"AgentAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgentAccount findUnique
   */
  export type AgentAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAccount
     */
    select?: AgentAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAccount
     */
    omit?: AgentAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentAccountInclude<ExtArgs> | null
    /**
     * Filter, which AgentAccount to fetch.
     */
    where: AgentAccountWhereUniqueInput
  }

  /**
   * AgentAccount findUniqueOrThrow
   */
  export type AgentAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAccount
     */
    select?: AgentAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAccount
     */
    omit?: AgentAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentAccountInclude<ExtArgs> | null
    /**
     * Filter, which AgentAccount to fetch.
     */
    where: AgentAccountWhereUniqueInput
  }

  /**
   * AgentAccount findFirst
   */
  export type AgentAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAccount
     */
    select?: AgentAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAccount
     */
    omit?: AgentAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentAccountInclude<ExtArgs> | null
    /**
     * Filter, which AgentAccount to fetch.
     */
    where?: AgentAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentAccounts to fetch.
     */
    orderBy?: AgentAccountOrderByWithRelationInput | AgentAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentAccounts.
     */
    cursor?: AgentAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentAccounts.
     */
    distinct?: AgentAccountScalarFieldEnum | AgentAccountScalarFieldEnum[]
  }

  /**
   * AgentAccount findFirstOrThrow
   */
  export type AgentAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAccount
     */
    select?: AgentAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAccount
     */
    omit?: AgentAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentAccountInclude<ExtArgs> | null
    /**
     * Filter, which AgentAccount to fetch.
     */
    where?: AgentAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentAccounts to fetch.
     */
    orderBy?: AgentAccountOrderByWithRelationInput | AgentAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentAccounts.
     */
    cursor?: AgentAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentAccounts.
     */
    distinct?: AgentAccountScalarFieldEnum | AgentAccountScalarFieldEnum[]
  }

  /**
   * AgentAccount findMany
   */
  export type AgentAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAccount
     */
    select?: AgentAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAccount
     */
    omit?: AgentAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentAccountInclude<ExtArgs> | null
    /**
     * Filter, which AgentAccounts to fetch.
     */
    where?: AgentAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentAccounts to fetch.
     */
    orderBy?: AgentAccountOrderByWithRelationInput | AgentAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentAccounts.
     */
    cursor?: AgentAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentAccounts.
     */
    skip?: number
    distinct?: AgentAccountScalarFieldEnum | AgentAccountScalarFieldEnum[]
  }

  /**
   * AgentAccount create
   */
  export type AgentAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAccount
     */
    select?: AgentAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAccount
     */
    omit?: AgentAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a AgentAccount.
     */
    data: XOR<AgentAccountCreateInput, AgentAccountUncheckedCreateInput>
  }

  /**
   * AgentAccount createMany
   */
  export type AgentAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentAccounts.
     */
    data: AgentAccountCreateManyInput | AgentAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentAccount createManyAndReturn
   */
  export type AgentAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAccount
     */
    select?: AgentAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAccount
     */
    omit?: AgentAccountOmit<ExtArgs> | null
    /**
     * The data used to create many AgentAccounts.
     */
    data: AgentAccountCreateManyInput | AgentAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentAccount update
   */
  export type AgentAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAccount
     */
    select?: AgentAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAccount
     */
    omit?: AgentAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a AgentAccount.
     */
    data: XOR<AgentAccountUpdateInput, AgentAccountUncheckedUpdateInput>
    /**
     * Choose, which AgentAccount to update.
     */
    where: AgentAccountWhereUniqueInput
  }

  /**
   * AgentAccount updateMany
   */
  export type AgentAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentAccounts.
     */
    data: XOR<AgentAccountUpdateManyMutationInput, AgentAccountUncheckedUpdateManyInput>
    /**
     * Filter which AgentAccounts to update
     */
    where?: AgentAccountWhereInput
    /**
     * Limit how many AgentAccounts to update.
     */
    limit?: number
  }

  /**
   * AgentAccount updateManyAndReturn
   */
  export type AgentAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAccount
     */
    select?: AgentAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAccount
     */
    omit?: AgentAccountOmit<ExtArgs> | null
    /**
     * The data used to update AgentAccounts.
     */
    data: XOR<AgentAccountUpdateManyMutationInput, AgentAccountUncheckedUpdateManyInput>
    /**
     * Filter which AgentAccounts to update
     */
    where?: AgentAccountWhereInput
    /**
     * Limit how many AgentAccounts to update.
     */
    limit?: number
  }

  /**
   * AgentAccount upsert
   */
  export type AgentAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAccount
     */
    select?: AgentAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAccount
     */
    omit?: AgentAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the AgentAccount to update in case it exists.
     */
    where: AgentAccountWhereUniqueInput
    /**
     * In case the AgentAccount found by the `where` argument doesn't exist, create a new AgentAccount with this data.
     */
    create: XOR<AgentAccountCreateInput, AgentAccountUncheckedCreateInput>
    /**
     * In case the AgentAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentAccountUpdateInput, AgentAccountUncheckedUpdateInput>
  }

  /**
   * AgentAccount delete
   */
  export type AgentAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAccount
     */
    select?: AgentAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAccount
     */
    omit?: AgentAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentAccountInclude<ExtArgs> | null
    /**
     * Filter which AgentAccount to delete.
     */
    where: AgentAccountWhereUniqueInput
  }

  /**
   * AgentAccount deleteMany
   */
  export type AgentAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentAccounts to delete
     */
    where?: AgentAccountWhereInput
    /**
     * Limit how many AgentAccounts to delete.
     */
    limit?: number
  }

  /**
   * AgentAccount.loginTokens
   */
  export type AgentAccount$loginTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginToken
     */
    select?: LoginTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginToken
     */
    omit?: LoginTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginTokenInclude<ExtArgs> | null
    where?: LoginTokenWhereInput
    orderBy?: LoginTokenOrderByWithRelationInput | LoginTokenOrderByWithRelationInput[]
    cursor?: LoginTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoginTokenScalarFieldEnum | LoginTokenScalarFieldEnum[]
  }

  /**
   * AgentAccount.audits
   */
  export type AgentAccount$auditsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAudit
     */
    select?: LoginAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAudit
     */
    omit?: LoginAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAuditInclude<ExtArgs> | null
    where?: LoginAuditWhereInput
    orderBy?: LoginAuditOrderByWithRelationInput | LoginAuditOrderByWithRelationInput[]
    cursor?: LoginAuditWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoginAuditScalarFieldEnum | LoginAuditScalarFieldEnum[]
  }

  /**
   * AgentAccount without action
   */
  export type AgentAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentAccount
     */
    select?: AgentAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentAccount
     */
    omit?: AgentAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentAccountInclude<ExtArgs> | null
  }


  /**
   * Model LoginToken
   */

  export type AggregateLoginToken = {
    _count: LoginTokenCountAggregateOutputType | null
    _min: LoginTokenMinAggregateOutputType | null
    _max: LoginTokenMaxAggregateOutputType | null
  }

  export type LoginTokenMinAggregateOutputType = {
    id: string | null
    agentId: string | null
    tokenHash: string | null
    expiresAt: Date | null
    consumedAt: Date | null
    createdAt: Date | null
  }

  export type LoginTokenMaxAggregateOutputType = {
    id: string | null
    agentId: string | null
    tokenHash: string | null
    expiresAt: Date | null
    consumedAt: Date | null
    createdAt: Date | null
  }

  export type LoginTokenCountAggregateOutputType = {
    id: number
    agentId: number
    tokenHash: number
    expiresAt: number
    consumedAt: number
    createdAt: number
    _all: number
  }


  export type LoginTokenMinAggregateInputType = {
    id?: true
    agentId?: true
    tokenHash?: true
    expiresAt?: true
    consumedAt?: true
    createdAt?: true
  }

  export type LoginTokenMaxAggregateInputType = {
    id?: true
    agentId?: true
    tokenHash?: true
    expiresAt?: true
    consumedAt?: true
    createdAt?: true
  }

  export type LoginTokenCountAggregateInputType = {
    id?: true
    agentId?: true
    tokenHash?: true
    expiresAt?: true
    consumedAt?: true
    createdAt?: true
    _all?: true
  }

  export type LoginTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginToken to aggregate.
     */
    where?: LoginTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginTokens to fetch.
     */
    orderBy?: LoginTokenOrderByWithRelationInput | LoginTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoginTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoginTokens
    **/
    _count?: true | LoginTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoginTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoginTokenMaxAggregateInputType
  }

  export type GetLoginTokenAggregateType<T extends LoginTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateLoginToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoginToken[P]>
      : GetScalarType<T[P], AggregateLoginToken[P]>
  }




  export type LoginTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginTokenWhereInput
    orderBy?: LoginTokenOrderByWithAggregationInput | LoginTokenOrderByWithAggregationInput[]
    by: LoginTokenScalarFieldEnum[] | LoginTokenScalarFieldEnum
    having?: LoginTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoginTokenCountAggregateInputType | true
    _min?: LoginTokenMinAggregateInputType
    _max?: LoginTokenMaxAggregateInputType
  }

  export type LoginTokenGroupByOutputType = {
    id: string
    agentId: string
    tokenHash: string
    expiresAt: Date
    consumedAt: Date | null
    createdAt: Date
    _count: LoginTokenCountAggregateOutputType | null
    _min: LoginTokenMinAggregateOutputType | null
    _max: LoginTokenMaxAggregateOutputType | null
  }

  type GetLoginTokenGroupByPayload<T extends LoginTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoginTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoginTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoginTokenGroupByOutputType[P]>
            : GetScalarType<T[P], LoginTokenGroupByOutputType[P]>
        }
      >
    >


  export type LoginTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentId?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    createdAt?: boolean
    agent?: boolean | AgentAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginToken"]>

  export type LoginTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentId?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    createdAt?: boolean
    agent?: boolean | AgentAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginToken"]>

  export type LoginTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentId?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    createdAt?: boolean
    agent?: boolean | AgentAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginToken"]>

  export type LoginTokenSelectScalar = {
    id?: boolean
    agentId?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    createdAt?: boolean
  }

  export type LoginTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "agentId" | "tokenHash" | "expiresAt" | "consumedAt" | "createdAt", ExtArgs["result"]["loginToken"]>
  export type LoginTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | AgentAccountDefaultArgs<ExtArgs>
  }
  export type LoginTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | AgentAccountDefaultArgs<ExtArgs>
  }
  export type LoginTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | AgentAccountDefaultArgs<ExtArgs>
  }

  export type $LoginTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoginToken"
    objects: {
      agent: Prisma.$AgentAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      agentId: string
      tokenHash: string
      expiresAt: Date
      consumedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["loginToken"]>
    composites: {}
  }

  type LoginTokenGetPayload<S extends boolean | null | undefined | LoginTokenDefaultArgs> = $Result.GetResult<Prisma.$LoginTokenPayload, S>

  type LoginTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoginTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoginTokenCountAggregateInputType | true
    }

  export interface LoginTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoginToken'], meta: { name: 'LoginToken' } }
    /**
     * Find zero or one LoginToken that matches the filter.
     * @param {LoginTokenFindUniqueArgs} args - Arguments to find a LoginToken
     * @example
     * // Get one LoginToken
     * const loginToken = await prisma.loginToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoginTokenFindUniqueArgs>(args: SelectSubset<T, LoginTokenFindUniqueArgs<ExtArgs>>): Prisma__LoginTokenClient<$Result.GetResult<Prisma.$LoginTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoginToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoginTokenFindUniqueOrThrowArgs} args - Arguments to find a LoginToken
     * @example
     * // Get one LoginToken
     * const loginToken = await prisma.loginToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoginTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, LoginTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoginTokenClient<$Result.GetResult<Prisma.$LoginTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginTokenFindFirstArgs} args - Arguments to find a LoginToken
     * @example
     * // Get one LoginToken
     * const loginToken = await prisma.loginToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoginTokenFindFirstArgs>(args?: SelectSubset<T, LoginTokenFindFirstArgs<ExtArgs>>): Prisma__LoginTokenClient<$Result.GetResult<Prisma.$LoginTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginTokenFindFirstOrThrowArgs} args - Arguments to find a LoginToken
     * @example
     * // Get one LoginToken
     * const loginToken = await prisma.loginToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoginTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, LoginTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoginTokenClient<$Result.GetResult<Prisma.$LoginTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoginTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoginTokens
     * const loginTokens = await prisma.loginToken.findMany()
     * 
     * // Get first 10 LoginTokens
     * const loginTokens = await prisma.loginToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loginTokenWithIdOnly = await prisma.loginToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoginTokenFindManyArgs>(args?: SelectSubset<T, LoginTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoginToken.
     * @param {LoginTokenCreateArgs} args - Arguments to create a LoginToken.
     * @example
     * // Create one LoginToken
     * const LoginToken = await prisma.loginToken.create({
     *   data: {
     *     // ... data to create a LoginToken
     *   }
     * })
     * 
     */
    create<T extends LoginTokenCreateArgs>(args: SelectSubset<T, LoginTokenCreateArgs<ExtArgs>>): Prisma__LoginTokenClient<$Result.GetResult<Prisma.$LoginTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoginTokens.
     * @param {LoginTokenCreateManyArgs} args - Arguments to create many LoginTokens.
     * @example
     * // Create many LoginTokens
     * const loginToken = await prisma.loginToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoginTokenCreateManyArgs>(args?: SelectSubset<T, LoginTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LoginTokens and returns the data saved in the database.
     * @param {LoginTokenCreateManyAndReturnArgs} args - Arguments to create many LoginTokens.
     * @example
     * // Create many LoginTokens
     * const loginToken = await prisma.loginToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LoginTokens and only return the `id`
     * const loginTokenWithIdOnly = await prisma.loginToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LoginTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, LoginTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LoginToken.
     * @param {LoginTokenDeleteArgs} args - Arguments to delete one LoginToken.
     * @example
     * // Delete one LoginToken
     * const LoginToken = await prisma.loginToken.delete({
     *   where: {
     *     // ... filter to delete one LoginToken
     *   }
     * })
     * 
     */
    delete<T extends LoginTokenDeleteArgs>(args: SelectSubset<T, LoginTokenDeleteArgs<ExtArgs>>): Prisma__LoginTokenClient<$Result.GetResult<Prisma.$LoginTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoginToken.
     * @param {LoginTokenUpdateArgs} args - Arguments to update one LoginToken.
     * @example
     * // Update one LoginToken
     * const loginToken = await prisma.loginToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoginTokenUpdateArgs>(args: SelectSubset<T, LoginTokenUpdateArgs<ExtArgs>>): Prisma__LoginTokenClient<$Result.GetResult<Prisma.$LoginTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoginTokens.
     * @param {LoginTokenDeleteManyArgs} args - Arguments to filter LoginTokens to delete.
     * @example
     * // Delete a few LoginTokens
     * const { count } = await prisma.loginToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoginTokenDeleteManyArgs>(args?: SelectSubset<T, LoginTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoginTokens
     * const loginToken = await prisma.loginToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoginTokenUpdateManyArgs>(args: SelectSubset<T, LoginTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginTokens and returns the data updated in the database.
     * @param {LoginTokenUpdateManyAndReturnArgs} args - Arguments to update many LoginTokens.
     * @example
     * // Update many LoginTokens
     * const loginToken = await prisma.loginToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LoginTokens and only return the `id`
     * const loginTokenWithIdOnly = await prisma.loginToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LoginTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, LoginTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LoginToken.
     * @param {LoginTokenUpsertArgs} args - Arguments to update or create a LoginToken.
     * @example
     * // Update or create a LoginToken
     * const loginToken = await prisma.loginToken.upsert({
     *   create: {
     *     // ... data to create a LoginToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoginToken we want to update
     *   }
     * })
     */
    upsert<T extends LoginTokenUpsertArgs>(args: SelectSubset<T, LoginTokenUpsertArgs<ExtArgs>>): Prisma__LoginTokenClient<$Result.GetResult<Prisma.$LoginTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LoginTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginTokenCountArgs} args - Arguments to filter LoginTokens to count.
     * @example
     * // Count the number of LoginTokens
     * const count = await prisma.loginToken.count({
     *   where: {
     *     // ... the filter for the LoginTokens we want to count
     *   }
     * })
    **/
    count<T extends LoginTokenCountArgs>(
      args?: Subset<T, LoginTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoginTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoginToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoginTokenAggregateArgs>(args: Subset<T, LoginTokenAggregateArgs>): Prisma.PrismaPromise<GetLoginTokenAggregateType<T>>

    /**
     * Group by LoginToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoginTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoginTokenGroupByArgs['orderBy'] }
        : { orderBy?: LoginTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoginTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoginTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoginToken model
   */
  readonly fields: LoginTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoginToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoginTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    agent<T extends AgentAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgentAccountDefaultArgs<ExtArgs>>): Prisma__AgentAccountClient<$Result.GetResult<Prisma.$AgentAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LoginToken model
   */
  interface LoginTokenFieldRefs {
    readonly id: FieldRef<"LoginToken", 'String'>
    readonly agentId: FieldRef<"LoginToken", 'String'>
    readonly tokenHash: FieldRef<"LoginToken", 'String'>
    readonly expiresAt: FieldRef<"LoginToken", 'DateTime'>
    readonly consumedAt: FieldRef<"LoginToken", 'DateTime'>
    readonly createdAt: FieldRef<"LoginToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LoginToken findUnique
   */
  export type LoginTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginToken
     */
    select?: LoginTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginToken
     */
    omit?: LoginTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginTokenInclude<ExtArgs> | null
    /**
     * Filter, which LoginToken to fetch.
     */
    where: LoginTokenWhereUniqueInput
  }

  /**
   * LoginToken findUniqueOrThrow
   */
  export type LoginTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginToken
     */
    select?: LoginTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginToken
     */
    omit?: LoginTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginTokenInclude<ExtArgs> | null
    /**
     * Filter, which LoginToken to fetch.
     */
    where: LoginTokenWhereUniqueInput
  }

  /**
   * LoginToken findFirst
   */
  export type LoginTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginToken
     */
    select?: LoginTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginToken
     */
    omit?: LoginTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginTokenInclude<ExtArgs> | null
    /**
     * Filter, which LoginToken to fetch.
     */
    where?: LoginTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginTokens to fetch.
     */
    orderBy?: LoginTokenOrderByWithRelationInput | LoginTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginTokens.
     */
    cursor?: LoginTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginTokens.
     */
    distinct?: LoginTokenScalarFieldEnum | LoginTokenScalarFieldEnum[]
  }

  /**
   * LoginToken findFirstOrThrow
   */
  export type LoginTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginToken
     */
    select?: LoginTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginToken
     */
    omit?: LoginTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginTokenInclude<ExtArgs> | null
    /**
     * Filter, which LoginToken to fetch.
     */
    where?: LoginTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginTokens to fetch.
     */
    orderBy?: LoginTokenOrderByWithRelationInput | LoginTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginTokens.
     */
    cursor?: LoginTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginTokens.
     */
    distinct?: LoginTokenScalarFieldEnum | LoginTokenScalarFieldEnum[]
  }

  /**
   * LoginToken findMany
   */
  export type LoginTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginToken
     */
    select?: LoginTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginToken
     */
    omit?: LoginTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginTokenInclude<ExtArgs> | null
    /**
     * Filter, which LoginTokens to fetch.
     */
    where?: LoginTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginTokens to fetch.
     */
    orderBy?: LoginTokenOrderByWithRelationInput | LoginTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoginTokens.
     */
    cursor?: LoginTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginTokens.
     */
    skip?: number
    distinct?: LoginTokenScalarFieldEnum | LoginTokenScalarFieldEnum[]
  }

  /**
   * LoginToken create
   */
  export type LoginTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginToken
     */
    select?: LoginTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginToken
     */
    omit?: LoginTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a LoginToken.
     */
    data: XOR<LoginTokenCreateInput, LoginTokenUncheckedCreateInput>
  }

  /**
   * LoginToken createMany
   */
  export type LoginTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoginTokens.
     */
    data: LoginTokenCreateManyInput | LoginTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoginToken createManyAndReturn
   */
  export type LoginTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginToken
     */
    select?: LoginTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoginToken
     */
    omit?: LoginTokenOmit<ExtArgs> | null
    /**
     * The data used to create many LoginTokens.
     */
    data: LoginTokenCreateManyInput | LoginTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoginToken update
   */
  export type LoginTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginToken
     */
    select?: LoginTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginToken
     */
    omit?: LoginTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a LoginToken.
     */
    data: XOR<LoginTokenUpdateInput, LoginTokenUncheckedUpdateInput>
    /**
     * Choose, which LoginToken to update.
     */
    where: LoginTokenWhereUniqueInput
  }

  /**
   * LoginToken updateMany
   */
  export type LoginTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoginTokens.
     */
    data: XOR<LoginTokenUpdateManyMutationInput, LoginTokenUncheckedUpdateManyInput>
    /**
     * Filter which LoginTokens to update
     */
    where?: LoginTokenWhereInput
    /**
     * Limit how many LoginTokens to update.
     */
    limit?: number
  }

  /**
   * LoginToken updateManyAndReturn
   */
  export type LoginTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginToken
     */
    select?: LoginTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoginToken
     */
    omit?: LoginTokenOmit<ExtArgs> | null
    /**
     * The data used to update LoginTokens.
     */
    data: XOR<LoginTokenUpdateManyMutationInput, LoginTokenUncheckedUpdateManyInput>
    /**
     * Filter which LoginTokens to update
     */
    where?: LoginTokenWhereInput
    /**
     * Limit how many LoginTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoginToken upsert
   */
  export type LoginTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginToken
     */
    select?: LoginTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginToken
     */
    omit?: LoginTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the LoginToken to update in case it exists.
     */
    where: LoginTokenWhereUniqueInput
    /**
     * In case the LoginToken found by the `where` argument doesn't exist, create a new LoginToken with this data.
     */
    create: XOR<LoginTokenCreateInput, LoginTokenUncheckedCreateInput>
    /**
     * In case the LoginToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoginTokenUpdateInput, LoginTokenUncheckedUpdateInput>
  }

  /**
   * LoginToken delete
   */
  export type LoginTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginToken
     */
    select?: LoginTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginToken
     */
    omit?: LoginTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginTokenInclude<ExtArgs> | null
    /**
     * Filter which LoginToken to delete.
     */
    where: LoginTokenWhereUniqueInput
  }

  /**
   * LoginToken deleteMany
   */
  export type LoginTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginTokens to delete
     */
    where?: LoginTokenWhereInput
    /**
     * Limit how many LoginTokens to delete.
     */
    limit?: number
  }

  /**
   * LoginToken without action
   */
  export type LoginTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginToken
     */
    select?: LoginTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginToken
     */
    omit?: LoginTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginTokenInclude<ExtArgs> | null
  }


  /**
   * Model LoginAudit
   */

  export type AggregateLoginAudit = {
    _count: LoginAuditCountAggregateOutputType | null
    _min: LoginAuditMinAggregateOutputType | null
    _max: LoginAuditMaxAggregateOutputType | null
  }

  export type LoginAuditMinAggregateOutputType = {
    id: string | null
    agentId: string | null
    status: $Enums.LoginAuditStatus | null
    ip: string | null
    userAgent: string | null
    note: string | null
    createdAt: Date | null
  }

  export type LoginAuditMaxAggregateOutputType = {
    id: string | null
    agentId: string | null
    status: $Enums.LoginAuditStatus | null
    ip: string | null
    userAgent: string | null
    note: string | null
    createdAt: Date | null
  }

  export type LoginAuditCountAggregateOutputType = {
    id: number
    agentId: number
    status: number
    ip: number
    userAgent: number
    note: number
    createdAt: number
    _all: number
  }


  export type LoginAuditMinAggregateInputType = {
    id?: true
    agentId?: true
    status?: true
    ip?: true
    userAgent?: true
    note?: true
    createdAt?: true
  }

  export type LoginAuditMaxAggregateInputType = {
    id?: true
    agentId?: true
    status?: true
    ip?: true
    userAgent?: true
    note?: true
    createdAt?: true
  }

  export type LoginAuditCountAggregateInputType = {
    id?: true
    agentId?: true
    status?: true
    ip?: true
    userAgent?: true
    note?: true
    createdAt?: true
    _all?: true
  }

  export type LoginAuditAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginAudit to aggregate.
     */
    where?: LoginAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginAudits to fetch.
     */
    orderBy?: LoginAuditOrderByWithRelationInput | LoginAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoginAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoginAudits
    **/
    _count?: true | LoginAuditCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoginAuditMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoginAuditMaxAggregateInputType
  }

  export type GetLoginAuditAggregateType<T extends LoginAuditAggregateArgs> = {
        [P in keyof T & keyof AggregateLoginAudit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoginAudit[P]>
      : GetScalarType<T[P], AggregateLoginAudit[P]>
  }




  export type LoginAuditGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginAuditWhereInput
    orderBy?: LoginAuditOrderByWithAggregationInput | LoginAuditOrderByWithAggregationInput[]
    by: LoginAuditScalarFieldEnum[] | LoginAuditScalarFieldEnum
    having?: LoginAuditScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoginAuditCountAggregateInputType | true
    _min?: LoginAuditMinAggregateInputType
    _max?: LoginAuditMaxAggregateInputType
  }

  export type LoginAuditGroupByOutputType = {
    id: string
    agentId: string
    status: $Enums.LoginAuditStatus
    ip: string | null
    userAgent: string | null
    note: string | null
    createdAt: Date
    _count: LoginAuditCountAggregateOutputType | null
    _min: LoginAuditMinAggregateOutputType | null
    _max: LoginAuditMaxAggregateOutputType | null
  }

  type GetLoginAuditGroupByPayload<T extends LoginAuditGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoginAuditGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoginAuditGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoginAuditGroupByOutputType[P]>
            : GetScalarType<T[P], LoginAuditGroupByOutputType[P]>
        }
      >
    >


  export type LoginAuditSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentId?: boolean
    status?: boolean
    ip?: boolean
    userAgent?: boolean
    note?: boolean
    createdAt?: boolean
    agent?: boolean | AgentAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginAudit"]>

  export type LoginAuditSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentId?: boolean
    status?: boolean
    ip?: boolean
    userAgent?: boolean
    note?: boolean
    createdAt?: boolean
    agent?: boolean | AgentAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginAudit"]>

  export type LoginAuditSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentId?: boolean
    status?: boolean
    ip?: boolean
    userAgent?: boolean
    note?: boolean
    createdAt?: boolean
    agent?: boolean | AgentAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginAudit"]>

  export type LoginAuditSelectScalar = {
    id?: boolean
    agentId?: boolean
    status?: boolean
    ip?: boolean
    userAgent?: boolean
    note?: boolean
    createdAt?: boolean
  }

  export type LoginAuditOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "agentId" | "status" | "ip" | "userAgent" | "note" | "createdAt", ExtArgs["result"]["loginAudit"]>
  export type LoginAuditInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | AgentAccountDefaultArgs<ExtArgs>
  }
  export type LoginAuditIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | AgentAccountDefaultArgs<ExtArgs>
  }
  export type LoginAuditIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | AgentAccountDefaultArgs<ExtArgs>
  }

  export type $LoginAuditPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoginAudit"
    objects: {
      agent: Prisma.$AgentAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      agentId: string
      status: $Enums.LoginAuditStatus
      ip: string | null
      userAgent: string | null
      note: string | null
      createdAt: Date
    }, ExtArgs["result"]["loginAudit"]>
    composites: {}
  }

  type LoginAuditGetPayload<S extends boolean | null | undefined | LoginAuditDefaultArgs> = $Result.GetResult<Prisma.$LoginAuditPayload, S>

  type LoginAuditCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoginAuditFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoginAuditCountAggregateInputType | true
    }

  export interface LoginAuditDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoginAudit'], meta: { name: 'LoginAudit' } }
    /**
     * Find zero or one LoginAudit that matches the filter.
     * @param {LoginAuditFindUniqueArgs} args - Arguments to find a LoginAudit
     * @example
     * // Get one LoginAudit
     * const loginAudit = await prisma.loginAudit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoginAuditFindUniqueArgs>(args: SelectSubset<T, LoginAuditFindUniqueArgs<ExtArgs>>): Prisma__LoginAuditClient<$Result.GetResult<Prisma.$LoginAuditPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoginAudit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoginAuditFindUniqueOrThrowArgs} args - Arguments to find a LoginAudit
     * @example
     * // Get one LoginAudit
     * const loginAudit = await prisma.loginAudit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoginAuditFindUniqueOrThrowArgs>(args: SelectSubset<T, LoginAuditFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoginAuditClient<$Result.GetResult<Prisma.$LoginAuditPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginAudit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAuditFindFirstArgs} args - Arguments to find a LoginAudit
     * @example
     * // Get one LoginAudit
     * const loginAudit = await prisma.loginAudit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoginAuditFindFirstArgs>(args?: SelectSubset<T, LoginAuditFindFirstArgs<ExtArgs>>): Prisma__LoginAuditClient<$Result.GetResult<Prisma.$LoginAuditPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginAudit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAuditFindFirstOrThrowArgs} args - Arguments to find a LoginAudit
     * @example
     * // Get one LoginAudit
     * const loginAudit = await prisma.loginAudit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoginAuditFindFirstOrThrowArgs>(args?: SelectSubset<T, LoginAuditFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoginAuditClient<$Result.GetResult<Prisma.$LoginAuditPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoginAudits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAuditFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoginAudits
     * const loginAudits = await prisma.loginAudit.findMany()
     * 
     * // Get first 10 LoginAudits
     * const loginAudits = await prisma.loginAudit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loginAuditWithIdOnly = await prisma.loginAudit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoginAuditFindManyArgs>(args?: SelectSubset<T, LoginAuditFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginAuditPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoginAudit.
     * @param {LoginAuditCreateArgs} args - Arguments to create a LoginAudit.
     * @example
     * // Create one LoginAudit
     * const LoginAudit = await prisma.loginAudit.create({
     *   data: {
     *     // ... data to create a LoginAudit
     *   }
     * })
     * 
     */
    create<T extends LoginAuditCreateArgs>(args: SelectSubset<T, LoginAuditCreateArgs<ExtArgs>>): Prisma__LoginAuditClient<$Result.GetResult<Prisma.$LoginAuditPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoginAudits.
     * @param {LoginAuditCreateManyArgs} args - Arguments to create many LoginAudits.
     * @example
     * // Create many LoginAudits
     * const loginAudit = await prisma.loginAudit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoginAuditCreateManyArgs>(args?: SelectSubset<T, LoginAuditCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LoginAudits and returns the data saved in the database.
     * @param {LoginAuditCreateManyAndReturnArgs} args - Arguments to create many LoginAudits.
     * @example
     * // Create many LoginAudits
     * const loginAudit = await prisma.loginAudit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LoginAudits and only return the `id`
     * const loginAuditWithIdOnly = await prisma.loginAudit.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LoginAuditCreateManyAndReturnArgs>(args?: SelectSubset<T, LoginAuditCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginAuditPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LoginAudit.
     * @param {LoginAuditDeleteArgs} args - Arguments to delete one LoginAudit.
     * @example
     * // Delete one LoginAudit
     * const LoginAudit = await prisma.loginAudit.delete({
     *   where: {
     *     // ... filter to delete one LoginAudit
     *   }
     * })
     * 
     */
    delete<T extends LoginAuditDeleteArgs>(args: SelectSubset<T, LoginAuditDeleteArgs<ExtArgs>>): Prisma__LoginAuditClient<$Result.GetResult<Prisma.$LoginAuditPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoginAudit.
     * @param {LoginAuditUpdateArgs} args - Arguments to update one LoginAudit.
     * @example
     * // Update one LoginAudit
     * const loginAudit = await prisma.loginAudit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoginAuditUpdateArgs>(args: SelectSubset<T, LoginAuditUpdateArgs<ExtArgs>>): Prisma__LoginAuditClient<$Result.GetResult<Prisma.$LoginAuditPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoginAudits.
     * @param {LoginAuditDeleteManyArgs} args - Arguments to filter LoginAudits to delete.
     * @example
     * // Delete a few LoginAudits
     * const { count } = await prisma.loginAudit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoginAuditDeleteManyArgs>(args?: SelectSubset<T, LoginAuditDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginAudits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAuditUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoginAudits
     * const loginAudit = await prisma.loginAudit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoginAuditUpdateManyArgs>(args: SelectSubset<T, LoginAuditUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginAudits and returns the data updated in the database.
     * @param {LoginAuditUpdateManyAndReturnArgs} args - Arguments to update many LoginAudits.
     * @example
     * // Update many LoginAudits
     * const loginAudit = await prisma.loginAudit.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LoginAudits and only return the `id`
     * const loginAuditWithIdOnly = await prisma.loginAudit.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LoginAuditUpdateManyAndReturnArgs>(args: SelectSubset<T, LoginAuditUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginAuditPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LoginAudit.
     * @param {LoginAuditUpsertArgs} args - Arguments to update or create a LoginAudit.
     * @example
     * // Update or create a LoginAudit
     * const loginAudit = await prisma.loginAudit.upsert({
     *   create: {
     *     // ... data to create a LoginAudit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoginAudit we want to update
     *   }
     * })
     */
    upsert<T extends LoginAuditUpsertArgs>(args: SelectSubset<T, LoginAuditUpsertArgs<ExtArgs>>): Prisma__LoginAuditClient<$Result.GetResult<Prisma.$LoginAuditPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LoginAudits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAuditCountArgs} args - Arguments to filter LoginAudits to count.
     * @example
     * // Count the number of LoginAudits
     * const count = await prisma.loginAudit.count({
     *   where: {
     *     // ... the filter for the LoginAudits we want to count
     *   }
     * })
    **/
    count<T extends LoginAuditCountArgs>(
      args?: Subset<T, LoginAuditCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoginAuditCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoginAudit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAuditAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoginAuditAggregateArgs>(args: Subset<T, LoginAuditAggregateArgs>): Prisma.PrismaPromise<GetLoginAuditAggregateType<T>>

    /**
     * Group by LoginAudit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAuditGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoginAuditGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoginAuditGroupByArgs['orderBy'] }
        : { orderBy?: LoginAuditGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoginAuditGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoginAuditGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoginAudit model
   */
  readonly fields: LoginAuditFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoginAudit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoginAuditClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    agent<T extends AgentAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgentAccountDefaultArgs<ExtArgs>>): Prisma__AgentAccountClient<$Result.GetResult<Prisma.$AgentAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LoginAudit model
   */
  interface LoginAuditFieldRefs {
    readonly id: FieldRef<"LoginAudit", 'String'>
    readonly agentId: FieldRef<"LoginAudit", 'String'>
    readonly status: FieldRef<"LoginAudit", 'LoginAuditStatus'>
    readonly ip: FieldRef<"LoginAudit", 'String'>
    readonly userAgent: FieldRef<"LoginAudit", 'String'>
    readonly note: FieldRef<"LoginAudit", 'String'>
    readonly createdAt: FieldRef<"LoginAudit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LoginAudit findUnique
   */
  export type LoginAuditFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAudit
     */
    select?: LoginAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAudit
     */
    omit?: LoginAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAuditInclude<ExtArgs> | null
    /**
     * Filter, which LoginAudit to fetch.
     */
    where: LoginAuditWhereUniqueInput
  }

  /**
   * LoginAudit findUniqueOrThrow
   */
  export type LoginAuditFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAudit
     */
    select?: LoginAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAudit
     */
    omit?: LoginAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAuditInclude<ExtArgs> | null
    /**
     * Filter, which LoginAudit to fetch.
     */
    where: LoginAuditWhereUniqueInput
  }

  /**
   * LoginAudit findFirst
   */
  export type LoginAuditFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAudit
     */
    select?: LoginAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAudit
     */
    omit?: LoginAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAuditInclude<ExtArgs> | null
    /**
     * Filter, which LoginAudit to fetch.
     */
    where?: LoginAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginAudits to fetch.
     */
    orderBy?: LoginAuditOrderByWithRelationInput | LoginAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginAudits.
     */
    cursor?: LoginAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginAudits.
     */
    distinct?: LoginAuditScalarFieldEnum | LoginAuditScalarFieldEnum[]
  }

  /**
   * LoginAudit findFirstOrThrow
   */
  export type LoginAuditFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAudit
     */
    select?: LoginAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAudit
     */
    omit?: LoginAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAuditInclude<ExtArgs> | null
    /**
     * Filter, which LoginAudit to fetch.
     */
    where?: LoginAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginAudits to fetch.
     */
    orderBy?: LoginAuditOrderByWithRelationInput | LoginAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginAudits.
     */
    cursor?: LoginAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginAudits.
     */
    distinct?: LoginAuditScalarFieldEnum | LoginAuditScalarFieldEnum[]
  }

  /**
   * LoginAudit findMany
   */
  export type LoginAuditFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAudit
     */
    select?: LoginAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAudit
     */
    omit?: LoginAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAuditInclude<ExtArgs> | null
    /**
     * Filter, which LoginAudits to fetch.
     */
    where?: LoginAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginAudits to fetch.
     */
    orderBy?: LoginAuditOrderByWithRelationInput | LoginAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoginAudits.
     */
    cursor?: LoginAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginAudits.
     */
    skip?: number
    distinct?: LoginAuditScalarFieldEnum | LoginAuditScalarFieldEnum[]
  }

  /**
   * LoginAudit create
   */
  export type LoginAuditCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAudit
     */
    select?: LoginAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAudit
     */
    omit?: LoginAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAuditInclude<ExtArgs> | null
    /**
     * The data needed to create a LoginAudit.
     */
    data: XOR<LoginAuditCreateInput, LoginAuditUncheckedCreateInput>
  }

  /**
   * LoginAudit createMany
   */
  export type LoginAuditCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoginAudits.
     */
    data: LoginAuditCreateManyInput | LoginAuditCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoginAudit createManyAndReturn
   */
  export type LoginAuditCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAudit
     */
    select?: LoginAuditSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAudit
     */
    omit?: LoginAuditOmit<ExtArgs> | null
    /**
     * The data used to create many LoginAudits.
     */
    data: LoginAuditCreateManyInput | LoginAuditCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAuditIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoginAudit update
   */
  export type LoginAuditUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAudit
     */
    select?: LoginAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAudit
     */
    omit?: LoginAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAuditInclude<ExtArgs> | null
    /**
     * The data needed to update a LoginAudit.
     */
    data: XOR<LoginAuditUpdateInput, LoginAuditUncheckedUpdateInput>
    /**
     * Choose, which LoginAudit to update.
     */
    where: LoginAuditWhereUniqueInput
  }

  /**
   * LoginAudit updateMany
   */
  export type LoginAuditUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoginAudits.
     */
    data: XOR<LoginAuditUpdateManyMutationInput, LoginAuditUncheckedUpdateManyInput>
    /**
     * Filter which LoginAudits to update
     */
    where?: LoginAuditWhereInput
    /**
     * Limit how many LoginAudits to update.
     */
    limit?: number
  }

  /**
   * LoginAudit updateManyAndReturn
   */
  export type LoginAuditUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAudit
     */
    select?: LoginAuditSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAudit
     */
    omit?: LoginAuditOmit<ExtArgs> | null
    /**
     * The data used to update LoginAudits.
     */
    data: XOR<LoginAuditUpdateManyMutationInput, LoginAuditUncheckedUpdateManyInput>
    /**
     * Filter which LoginAudits to update
     */
    where?: LoginAuditWhereInput
    /**
     * Limit how many LoginAudits to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAuditIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoginAudit upsert
   */
  export type LoginAuditUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAudit
     */
    select?: LoginAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAudit
     */
    omit?: LoginAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAuditInclude<ExtArgs> | null
    /**
     * The filter to search for the LoginAudit to update in case it exists.
     */
    where: LoginAuditWhereUniqueInput
    /**
     * In case the LoginAudit found by the `where` argument doesn't exist, create a new LoginAudit with this data.
     */
    create: XOR<LoginAuditCreateInput, LoginAuditUncheckedCreateInput>
    /**
     * In case the LoginAudit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoginAuditUpdateInput, LoginAuditUncheckedUpdateInput>
  }

  /**
   * LoginAudit delete
   */
  export type LoginAuditDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAudit
     */
    select?: LoginAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAudit
     */
    omit?: LoginAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAuditInclude<ExtArgs> | null
    /**
     * Filter which LoginAudit to delete.
     */
    where: LoginAuditWhereUniqueInput
  }

  /**
   * LoginAudit deleteMany
   */
  export type LoginAuditDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginAudits to delete
     */
    where?: LoginAuditWhereInput
    /**
     * Limit how many LoginAudits to delete.
     */
    limit?: number
  }

  /**
   * LoginAudit without action
   */
  export type LoginAuditDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAudit
     */
    select?: LoginAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAudit
     */
    omit?: LoginAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAuditInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    phone: 'phone',
    address: 'address',
    longSummary: 'longSummary',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const OrderScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    orderId: 'orderId',
    createdAt: 'createdAt',
    status: 'status'
  };

  export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum]


  export const ChatSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    endedAt: 'endedAt',
    messages: 'messages',
    summary: 'summary',
    lastSummarizedIndex: 'lastSummarizedIndex',
    unsummarizedLimit: 'unsummarizedLimit'
  };

  export type ChatSessionScalarFieldEnum = (typeof ChatSessionScalarFieldEnum)[keyof typeof ChatSessionScalarFieldEnum]


  export const TicketScalarFieldEnum: {
    id: 'id',
    ticket: 'ticket',
    createdAt: 'createdAt',
    userId: 'userId'
  };

  export type TicketScalarFieldEnum = (typeof TicketScalarFieldEnum)[keyof typeof TicketScalarFieldEnum]


  export const ConversationMessageScalarFieldEnum: {
    id: 'id',
    messageId: 'messageId',
    conversationId: 'conversationId',
    inboxId: 'inboxId',
    conversationKey: 'conversationKey',
    sender: 'sender',
    content: 'content',
    createdAt: 'createdAt'
  };

  export type ConversationMessageScalarFieldEnum = (typeof ConversationMessageScalarFieldEnum)[keyof typeof ConversationMessageScalarFieldEnum]


  export const AgentAssignmentScalarFieldEnum: {
    inboxId: 'inboxId',
    agentId: 'agentId',
    lastAssignedAt: 'lastAssignedAt',
    activeConversationId: 'activeConversationId',
    availabilityBeforeBusy: 'availabilityBeforeBusy'
  };

  export type AgentAssignmentScalarFieldEnum = (typeof AgentAssignmentScalarFieldEnum)[keyof typeof AgentAssignmentScalarFieldEnum]


  export const HandoffRequestScalarFieldEnum: {
    conversationKey: 'conversationKey',
    conversationId: 'conversationId',
    accountId: 'accountId',
    inboxId: 'inboxId',
    requestedAt: 'requestedAt',
    status: 'status',
    agentId: 'agentId',
    lastPositionNotified: 'lastPositionNotified'
  };

  export type HandoffRequestScalarFieldEnum = (typeof HandoffRequestScalarFieldEnum)[keyof typeof HandoffRequestScalarFieldEnum]


  export const ScrapeJobScalarFieldEnum: {
    id: 'id',
    script: 'script',
    args: 'args',
    status: 'status',
    cadence: 'cadence',
    autoRunManualWithNext: 'autoRunManualWithNext',
    paused: 'paused',
    progress: 'progress',
    startedAt: 'startedAt',
    finishedAt: 'finishedAt',
    logPath: 'logPath',
    nextRunAt: 'nextRunAt',
    durationSeconds: 'durationSeconds',
    documentsIngested: 'documentsIngested',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ScrapeJobScalarFieldEnum = (typeof ScrapeJobScalarFieldEnum)[keyof typeof ScrapeJobScalarFieldEnum]


  export const AgentAccountScalarFieldEnum: {
    userId: 'userId',
    hashedPin: 'hashedPin',
    telegramChatId: 'telegramChatId',
    roles: 'roles',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AgentAccountScalarFieldEnum = (typeof AgentAccountScalarFieldEnum)[keyof typeof AgentAccountScalarFieldEnum]


  export const LoginTokenScalarFieldEnum: {
    id: 'id',
    agentId: 'agentId',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    consumedAt: 'consumedAt',
    createdAt: 'createdAt'
  };

  export type LoginTokenScalarFieldEnum = (typeof LoginTokenScalarFieldEnum)[keyof typeof LoginTokenScalarFieldEnum]


  export const LoginAuditScalarFieldEnum: {
    id: 'id',
    agentId: 'agentId',
    status: 'status',
    ip: 'ip',
    userAgent: 'userAgent',
    note: 'note',
    createdAt: 'createdAt'
  };

  export type LoginAuditScalarFieldEnum = (typeof LoginAuditScalarFieldEnum)[keyof typeof LoginAuditScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'AgentAvailability'
   */
  export type EnumAgentAvailabilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AgentAvailability'>
    


  /**
   * Reference to a field of type 'AgentAvailability[]'
   */
  export type ListEnumAgentAvailabilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AgentAvailability[]'>
    


  /**
   * Reference to a field of type 'HandoffRequestStatus'
   */
  export type EnumHandoffRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HandoffRequestStatus'>
    


  /**
   * Reference to a field of type 'HandoffRequestStatus[]'
   */
  export type ListEnumHandoffRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HandoffRequestStatus[]'>
    


  /**
   * Reference to a field of type 'ScrapeJobStatus'
   */
  export type EnumScrapeJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ScrapeJobStatus'>
    


  /**
   * Reference to a field of type 'ScrapeJobStatus[]'
   */
  export type ListEnumScrapeJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ScrapeJobStatus[]'>
    


  /**
   * Reference to a field of type 'ScrapeJobCadence'
   */
  export type EnumScrapeJobCadenceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ScrapeJobCadence'>
    


  /**
   * Reference to a field of type 'ScrapeJobCadence[]'
   */
  export type ListEnumScrapeJobCadenceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ScrapeJobCadence[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'AgentRole[]'
   */
  export type ListEnumAgentRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AgentRole[]'>
    


  /**
   * Reference to a field of type 'AgentRole'
   */
  export type EnumAgentRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AgentRole'>
    


  /**
   * Reference to a field of type 'LoginAuditStatus'
   */
  export type EnumLoginAuditStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LoginAuditStatus'>
    


  /**
   * Reference to a field of type 'LoginAuditStatus[]'
   */
  export type ListEnumLoginAuditStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LoginAuditStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    longSummary?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    orders?: OrderListRelationFilter
    sessions?: ChatSessionListRelationFilter
    tickets?: TicketListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    longSummary?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    orders?: OrderOrderByRelationAggregateInput
    sessions?: ChatSessionOrderByRelationAggregateInput
    tickets?: TicketOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    longSummary?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    orders?: OrderListRelationFilter
    sessions?: ChatSessionListRelationFilter
    tickets?: TicketListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    longSummary?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    address?: StringNullableWithAggregatesFilter<"User"> | string | null
    longSummary?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type OrderWhereInput = {
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    id?: StringFilter<"Order"> | string
    userId?: StringNullableFilter<"Order"> | string | null
    orderId?: StringFilter<"Order"> | string
    createdAt?: DateTimeFilter<"Order"> | Date | string
    status?: StringNullableFilter<"Order"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type OrderOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
    status?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orderId?: string
    AND?: OrderWhereInput | OrderWhereInput[]
    OR?: OrderWhereInput[]
    NOT?: OrderWhereInput | OrderWhereInput[]
    userId?: StringNullableFilter<"Order"> | string | null
    createdAt?: DateTimeFilter<"Order"> | Date | string
    status?: StringNullableFilter<"Order"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "orderId">

  export type OrderOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
    status?: SortOrderInput | SortOrder
    _count?: OrderCountOrderByAggregateInput
    _max?: OrderMaxOrderByAggregateInput
    _min?: OrderMinOrderByAggregateInput
  }

  export type OrderScalarWhereWithAggregatesInput = {
    AND?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    OR?: OrderScalarWhereWithAggregatesInput[]
    NOT?: OrderScalarWhereWithAggregatesInput | OrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Order"> | string
    userId?: StringNullableWithAggregatesFilter<"Order"> | string | null
    orderId?: StringWithAggregatesFilter<"Order"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Order"> | Date | string
    status?: StringNullableWithAggregatesFilter<"Order"> | string | null
  }

  export type ChatSessionWhereInput = {
    AND?: ChatSessionWhereInput | ChatSessionWhereInput[]
    OR?: ChatSessionWhereInput[]
    NOT?: ChatSessionWhereInput | ChatSessionWhereInput[]
    id?: StringFilter<"ChatSession"> | string
    userId?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"ChatSession"> | Date | string | null
    messages?: JsonFilter<"ChatSession">
    summary?: StringNullableFilter<"ChatSession"> | string | null
    lastSummarizedIndex?: IntFilter<"ChatSession"> | number
    unsummarizedLimit?: IntFilter<"ChatSession"> | number
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ChatSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    messages?: SortOrder
    summary?: SortOrderInput | SortOrder
    lastSummarizedIndex?: SortOrder
    unsummarizedLimit?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ChatSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatSessionWhereInput | ChatSessionWhereInput[]
    OR?: ChatSessionWhereInput[]
    NOT?: ChatSessionWhereInput | ChatSessionWhereInput[]
    userId?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"ChatSession"> | Date | string | null
    messages?: JsonFilter<"ChatSession">
    summary?: StringNullableFilter<"ChatSession"> | string | null
    lastSummarizedIndex?: IntFilter<"ChatSession"> | number
    unsummarizedLimit?: IntFilter<"ChatSession"> | number
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type ChatSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    messages?: SortOrder
    summary?: SortOrderInput | SortOrder
    lastSummarizedIndex?: SortOrder
    unsummarizedLimit?: SortOrder
    _count?: ChatSessionCountOrderByAggregateInput
    _avg?: ChatSessionAvgOrderByAggregateInput
    _max?: ChatSessionMaxOrderByAggregateInput
    _min?: ChatSessionMinOrderByAggregateInput
    _sum?: ChatSessionSumOrderByAggregateInput
  }

  export type ChatSessionScalarWhereWithAggregatesInput = {
    AND?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    OR?: ChatSessionScalarWhereWithAggregatesInput[]
    NOT?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatSession"> | string
    userId?: StringWithAggregatesFilter<"ChatSession"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
    endedAt?: DateTimeNullableWithAggregatesFilter<"ChatSession"> | Date | string | null
    messages?: JsonWithAggregatesFilter<"ChatSession">
    summary?: StringNullableWithAggregatesFilter<"ChatSession"> | string | null
    lastSummarizedIndex?: IntWithAggregatesFilter<"ChatSession"> | number
    unsummarizedLimit?: IntWithAggregatesFilter<"ChatSession"> | number
  }

  export type TicketWhereInput = {
    AND?: TicketWhereInput | TicketWhereInput[]
    OR?: TicketWhereInput[]
    NOT?: TicketWhereInput | TicketWhereInput[]
    id?: StringFilter<"Ticket"> | string
    ticket?: StringFilter<"Ticket"> | string
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    userId?: StringNullableFilter<"Ticket"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type TicketOrderByWithRelationInput = {
    id?: SortOrder
    ticket?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TicketWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TicketWhereInput | TicketWhereInput[]
    OR?: TicketWhereInput[]
    NOT?: TicketWhereInput | TicketWhereInput[]
    ticket?: StringFilter<"Ticket"> | string
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    userId?: StringNullableFilter<"Ticket"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type TicketOrderByWithAggregationInput = {
    id?: SortOrder
    ticket?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    _count?: TicketCountOrderByAggregateInput
    _max?: TicketMaxOrderByAggregateInput
    _min?: TicketMinOrderByAggregateInput
  }

  export type TicketScalarWhereWithAggregatesInput = {
    AND?: TicketScalarWhereWithAggregatesInput | TicketScalarWhereWithAggregatesInput[]
    OR?: TicketScalarWhereWithAggregatesInput[]
    NOT?: TicketScalarWhereWithAggregatesInput | TicketScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ticket"> | string
    ticket?: StringWithAggregatesFilter<"Ticket"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Ticket"> | Date | string
    userId?: StringNullableWithAggregatesFilter<"Ticket"> | string | null
  }

  export type ConversationMessageWhereInput = {
    AND?: ConversationMessageWhereInput | ConversationMessageWhereInput[]
    OR?: ConversationMessageWhereInput[]
    NOT?: ConversationMessageWhereInput | ConversationMessageWhereInput[]
    id?: IntFilter<"ConversationMessage"> | number
    messageId?: IntFilter<"ConversationMessage"> | number
    conversationId?: IntFilter<"ConversationMessage"> | number
    inboxId?: IntFilter<"ConversationMessage"> | number
    conversationKey?: StringFilter<"ConversationMessage"> | string
    sender?: StringFilter<"ConversationMessage"> | string
    content?: StringFilter<"ConversationMessage"> | string
    createdAt?: DateTimeFilter<"ConversationMessage"> | Date | string
  }

  export type ConversationMessageOrderByWithRelationInput = {
    id?: SortOrder
    messageId?: SortOrder
    conversationId?: SortOrder
    inboxId?: SortOrder
    conversationKey?: SortOrder
    sender?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type ConversationMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    conversationKey_messageId?: ConversationMessageConversationKeyMessageIdCompoundUniqueInput
    AND?: ConversationMessageWhereInput | ConversationMessageWhereInput[]
    OR?: ConversationMessageWhereInput[]
    NOT?: ConversationMessageWhereInput | ConversationMessageWhereInput[]
    messageId?: IntFilter<"ConversationMessage"> | number
    conversationId?: IntFilter<"ConversationMessage"> | number
    inboxId?: IntFilter<"ConversationMessage"> | number
    conversationKey?: StringFilter<"ConversationMessage"> | string
    sender?: StringFilter<"ConversationMessage"> | string
    content?: StringFilter<"ConversationMessage"> | string
    createdAt?: DateTimeFilter<"ConversationMessage"> | Date | string
  }, "id" | "conversationKey_messageId">

  export type ConversationMessageOrderByWithAggregationInput = {
    id?: SortOrder
    messageId?: SortOrder
    conversationId?: SortOrder
    inboxId?: SortOrder
    conversationKey?: SortOrder
    sender?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    _count?: ConversationMessageCountOrderByAggregateInput
    _avg?: ConversationMessageAvgOrderByAggregateInput
    _max?: ConversationMessageMaxOrderByAggregateInput
    _min?: ConversationMessageMinOrderByAggregateInput
    _sum?: ConversationMessageSumOrderByAggregateInput
  }

  export type ConversationMessageScalarWhereWithAggregatesInput = {
    AND?: ConversationMessageScalarWhereWithAggregatesInput | ConversationMessageScalarWhereWithAggregatesInput[]
    OR?: ConversationMessageScalarWhereWithAggregatesInput[]
    NOT?: ConversationMessageScalarWhereWithAggregatesInput | ConversationMessageScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ConversationMessage"> | number
    messageId?: IntWithAggregatesFilter<"ConversationMessage"> | number
    conversationId?: IntWithAggregatesFilter<"ConversationMessage"> | number
    inboxId?: IntWithAggregatesFilter<"ConversationMessage"> | number
    conversationKey?: StringWithAggregatesFilter<"ConversationMessage"> | string
    sender?: StringWithAggregatesFilter<"ConversationMessage"> | string
    content?: StringWithAggregatesFilter<"ConversationMessage"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ConversationMessage"> | Date | string
  }

  export type AgentAssignmentWhereInput = {
    AND?: AgentAssignmentWhereInput | AgentAssignmentWhereInput[]
    OR?: AgentAssignmentWhereInput[]
    NOT?: AgentAssignmentWhereInput | AgentAssignmentWhereInput[]
    inboxId?: IntFilter<"AgentAssignment"> | number
    agentId?: IntFilter<"AgentAssignment"> | number
    lastAssignedAt?: DateTimeNullableFilter<"AgentAssignment"> | Date | string | null
    activeConversationId?: IntNullableFilter<"AgentAssignment"> | number | null
    availabilityBeforeBusy?: EnumAgentAvailabilityNullableFilter<"AgentAssignment"> | $Enums.AgentAvailability | null
  }

  export type AgentAssignmentOrderByWithRelationInput = {
    inboxId?: SortOrder
    agentId?: SortOrder
    lastAssignedAt?: SortOrderInput | SortOrder
    activeConversationId?: SortOrderInput | SortOrder
    availabilityBeforeBusy?: SortOrderInput | SortOrder
  }

  export type AgentAssignmentWhereUniqueInput = Prisma.AtLeast<{
    inboxId_agentId?: AgentAssignmentInboxIdAgentIdCompoundUniqueInput
    AND?: AgentAssignmentWhereInput | AgentAssignmentWhereInput[]
    OR?: AgentAssignmentWhereInput[]
    NOT?: AgentAssignmentWhereInput | AgentAssignmentWhereInput[]
    inboxId?: IntFilter<"AgentAssignment"> | number
    agentId?: IntFilter<"AgentAssignment"> | number
    lastAssignedAt?: DateTimeNullableFilter<"AgentAssignment"> | Date | string | null
    activeConversationId?: IntNullableFilter<"AgentAssignment"> | number | null
    availabilityBeforeBusy?: EnumAgentAvailabilityNullableFilter<"AgentAssignment"> | $Enums.AgentAvailability | null
  }, "inboxId_agentId">

  export type AgentAssignmentOrderByWithAggregationInput = {
    inboxId?: SortOrder
    agentId?: SortOrder
    lastAssignedAt?: SortOrderInput | SortOrder
    activeConversationId?: SortOrderInput | SortOrder
    availabilityBeforeBusy?: SortOrderInput | SortOrder
    _count?: AgentAssignmentCountOrderByAggregateInput
    _avg?: AgentAssignmentAvgOrderByAggregateInput
    _max?: AgentAssignmentMaxOrderByAggregateInput
    _min?: AgentAssignmentMinOrderByAggregateInput
    _sum?: AgentAssignmentSumOrderByAggregateInput
  }

  export type AgentAssignmentScalarWhereWithAggregatesInput = {
    AND?: AgentAssignmentScalarWhereWithAggregatesInput | AgentAssignmentScalarWhereWithAggregatesInput[]
    OR?: AgentAssignmentScalarWhereWithAggregatesInput[]
    NOT?: AgentAssignmentScalarWhereWithAggregatesInput | AgentAssignmentScalarWhereWithAggregatesInput[]
    inboxId?: IntWithAggregatesFilter<"AgentAssignment"> | number
    agentId?: IntWithAggregatesFilter<"AgentAssignment"> | number
    lastAssignedAt?: DateTimeNullableWithAggregatesFilter<"AgentAssignment"> | Date | string | null
    activeConversationId?: IntNullableWithAggregatesFilter<"AgentAssignment"> | number | null
    availabilityBeforeBusy?: EnumAgentAvailabilityNullableWithAggregatesFilter<"AgentAssignment"> | $Enums.AgentAvailability | null
  }

  export type HandoffRequestWhereInput = {
    AND?: HandoffRequestWhereInput | HandoffRequestWhereInput[]
    OR?: HandoffRequestWhereInput[]
    NOT?: HandoffRequestWhereInput | HandoffRequestWhereInput[]
    conversationKey?: StringFilter<"HandoffRequest"> | string
    conversationId?: IntFilter<"HandoffRequest"> | number
    accountId?: IntFilter<"HandoffRequest"> | number
    inboxId?: IntFilter<"HandoffRequest"> | number
    requestedAt?: DateTimeFilter<"HandoffRequest"> | Date | string
    status?: EnumHandoffRequestStatusFilter<"HandoffRequest"> | $Enums.HandoffRequestStatus
    agentId?: IntNullableFilter<"HandoffRequest"> | number | null
    lastPositionNotified?: IntNullableFilter<"HandoffRequest"> | number | null
  }

  export type HandoffRequestOrderByWithRelationInput = {
    conversationKey?: SortOrder
    conversationId?: SortOrder
    accountId?: SortOrder
    inboxId?: SortOrder
    requestedAt?: SortOrder
    status?: SortOrder
    agentId?: SortOrderInput | SortOrder
    lastPositionNotified?: SortOrderInput | SortOrder
  }

  export type HandoffRequestWhereUniqueInput = Prisma.AtLeast<{
    conversationKey?: string
    AND?: HandoffRequestWhereInput | HandoffRequestWhereInput[]
    OR?: HandoffRequestWhereInput[]
    NOT?: HandoffRequestWhereInput | HandoffRequestWhereInput[]
    conversationId?: IntFilter<"HandoffRequest"> | number
    accountId?: IntFilter<"HandoffRequest"> | number
    inboxId?: IntFilter<"HandoffRequest"> | number
    requestedAt?: DateTimeFilter<"HandoffRequest"> | Date | string
    status?: EnumHandoffRequestStatusFilter<"HandoffRequest"> | $Enums.HandoffRequestStatus
    agentId?: IntNullableFilter<"HandoffRequest"> | number | null
    lastPositionNotified?: IntNullableFilter<"HandoffRequest"> | number | null
  }, "conversationKey">

  export type HandoffRequestOrderByWithAggregationInput = {
    conversationKey?: SortOrder
    conversationId?: SortOrder
    accountId?: SortOrder
    inboxId?: SortOrder
    requestedAt?: SortOrder
    status?: SortOrder
    agentId?: SortOrderInput | SortOrder
    lastPositionNotified?: SortOrderInput | SortOrder
    _count?: HandoffRequestCountOrderByAggregateInput
    _avg?: HandoffRequestAvgOrderByAggregateInput
    _max?: HandoffRequestMaxOrderByAggregateInput
    _min?: HandoffRequestMinOrderByAggregateInput
    _sum?: HandoffRequestSumOrderByAggregateInput
  }

  export type HandoffRequestScalarWhereWithAggregatesInput = {
    AND?: HandoffRequestScalarWhereWithAggregatesInput | HandoffRequestScalarWhereWithAggregatesInput[]
    OR?: HandoffRequestScalarWhereWithAggregatesInput[]
    NOT?: HandoffRequestScalarWhereWithAggregatesInput | HandoffRequestScalarWhereWithAggregatesInput[]
    conversationKey?: StringWithAggregatesFilter<"HandoffRequest"> | string
    conversationId?: IntWithAggregatesFilter<"HandoffRequest"> | number
    accountId?: IntWithAggregatesFilter<"HandoffRequest"> | number
    inboxId?: IntWithAggregatesFilter<"HandoffRequest"> | number
    requestedAt?: DateTimeWithAggregatesFilter<"HandoffRequest"> | Date | string
    status?: EnumHandoffRequestStatusWithAggregatesFilter<"HandoffRequest"> | $Enums.HandoffRequestStatus
    agentId?: IntNullableWithAggregatesFilter<"HandoffRequest"> | number | null
    lastPositionNotified?: IntNullableWithAggregatesFilter<"HandoffRequest"> | number | null
  }

  export type ScrapeJobWhereInput = {
    AND?: ScrapeJobWhereInput | ScrapeJobWhereInput[]
    OR?: ScrapeJobWhereInput[]
    NOT?: ScrapeJobWhereInput | ScrapeJobWhereInput[]
    id?: StringFilter<"ScrapeJob"> | string
    script?: StringFilter<"ScrapeJob"> | string
    args?: JsonNullableFilter<"ScrapeJob">
    status?: EnumScrapeJobStatusFilter<"ScrapeJob"> | $Enums.ScrapeJobStatus
    cadence?: EnumScrapeJobCadenceFilter<"ScrapeJob"> | $Enums.ScrapeJobCadence
    autoRunManualWithNext?: BoolFilter<"ScrapeJob"> | boolean
    paused?: BoolFilter<"ScrapeJob"> | boolean
    progress?: IntFilter<"ScrapeJob"> | number
    startedAt?: DateTimeNullableFilter<"ScrapeJob"> | Date | string | null
    finishedAt?: DateTimeNullableFilter<"ScrapeJob"> | Date | string | null
    logPath?: StringNullableFilter<"ScrapeJob"> | string | null
    nextRunAt?: DateTimeNullableFilter<"ScrapeJob"> | Date | string | null
    durationSeconds?: FloatNullableFilter<"ScrapeJob"> | number | null
    documentsIngested?: IntNullableFilter<"ScrapeJob"> | number | null
    createdAt?: DateTimeFilter<"ScrapeJob"> | Date | string
    updatedAt?: DateTimeFilter<"ScrapeJob"> | Date | string
  }

  export type ScrapeJobOrderByWithRelationInput = {
    id?: SortOrder
    script?: SortOrder
    args?: SortOrderInput | SortOrder
    status?: SortOrder
    cadence?: SortOrder
    autoRunManualWithNext?: SortOrder
    paused?: SortOrder
    progress?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    finishedAt?: SortOrderInput | SortOrder
    logPath?: SortOrderInput | SortOrder
    nextRunAt?: SortOrderInput | SortOrder
    durationSeconds?: SortOrderInput | SortOrder
    documentsIngested?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapeJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScrapeJobWhereInput | ScrapeJobWhereInput[]
    OR?: ScrapeJobWhereInput[]
    NOT?: ScrapeJobWhereInput | ScrapeJobWhereInput[]
    script?: StringFilter<"ScrapeJob"> | string
    args?: JsonNullableFilter<"ScrapeJob">
    status?: EnumScrapeJobStatusFilter<"ScrapeJob"> | $Enums.ScrapeJobStatus
    cadence?: EnumScrapeJobCadenceFilter<"ScrapeJob"> | $Enums.ScrapeJobCadence
    autoRunManualWithNext?: BoolFilter<"ScrapeJob"> | boolean
    paused?: BoolFilter<"ScrapeJob"> | boolean
    progress?: IntFilter<"ScrapeJob"> | number
    startedAt?: DateTimeNullableFilter<"ScrapeJob"> | Date | string | null
    finishedAt?: DateTimeNullableFilter<"ScrapeJob"> | Date | string | null
    logPath?: StringNullableFilter<"ScrapeJob"> | string | null
    nextRunAt?: DateTimeNullableFilter<"ScrapeJob"> | Date | string | null
    durationSeconds?: FloatNullableFilter<"ScrapeJob"> | number | null
    documentsIngested?: IntNullableFilter<"ScrapeJob"> | number | null
    createdAt?: DateTimeFilter<"ScrapeJob"> | Date | string
    updatedAt?: DateTimeFilter<"ScrapeJob"> | Date | string
  }, "id">

  export type ScrapeJobOrderByWithAggregationInput = {
    id?: SortOrder
    script?: SortOrder
    args?: SortOrderInput | SortOrder
    status?: SortOrder
    cadence?: SortOrder
    autoRunManualWithNext?: SortOrder
    paused?: SortOrder
    progress?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    finishedAt?: SortOrderInput | SortOrder
    logPath?: SortOrderInput | SortOrder
    nextRunAt?: SortOrderInput | SortOrder
    durationSeconds?: SortOrderInput | SortOrder
    documentsIngested?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ScrapeJobCountOrderByAggregateInput
    _avg?: ScrapeJobAvgOrderByAggregateInput
    _max?: ScrapeJobMaxOrderByAggregateInput
    _min?: ScrapeJobMinOrderByAggregateInput
    _sum?: ScrapeJobSumOrderByAggregateInput
  }

  export type ScrapeJobScalarWhereWithAggregatesInput = {
    AND?: ScrapeJobScalarWhereWithAggregatesInput | ScrapeJobScalarWhereWithAggregatesInput[]
    OR?: ScrapeJobScalarWhereWithAggregatesInput[]
    NOT?: ScrapeJobScalarWhereWithAggregatesInput | ScrapeJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ScrapeJob"> | string
    script?: StringWithAggregatesFilter<"ScrapeJob"> | string
    args?: JsonNullableWithAggregatesFilter<"ScrapeJob">
    status?: EnumScrapeJobStatusWithAggregatesFilter<"ScrapeJob"> | $Enums.ScrapeJobStatus
    cadence?: EnumScrapeJobCadenceWithAggregatesFilter<"ScrapeJob"> | $Enums.ScrapeJobCadence
    autoRunManualWithNext?: BoolWithAggregatesFilter<"ScrapeJob"> | boolean
    paused?: BoolWithAggregatesFilter<"ScrapeJob"> | boolean
    progress?: IntWithAggregatesFilter<"ScrapeJob"> | number
    startedAt?: DateTimeNullableWithAggregatesFilter<"ScrapeJob"> | Date | string | null
    finishedAt?: DateTimeNullableWithAggregatesFilter<"ScrapeJob"> | Date | string | null
    logPath?: StringNullableWithAggregatesFilter<"ScrapeJob"> | string | null
    nextRunAt?: DateTimeNullableWithAggregatesFilter<"ScrapeJob"> | Date | string | null
    durationSeconds?: FloatNullableWithAggregatesFilter<"ScrapeJob"> | number | null
    documentsIngested?: IntNullableWithAggregatesFilter<"ScrapeJob"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"ScrapeJob"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ScrapeJob"> | Date | string
  }

  export type AgentAccountWhereInput = {
    AND?: AgentAccountWhereInput | AgentAccountWhereInput[]
    OR?: AgentAccountWhereInput[]
    NOT?: AgentAccountWhereInput | AgentAccountWhereInput[]
    userId?: StringFilter<"AgentAccount"> | string
    hashedPin?: StringFilter<"AgentAccount"> | string
    telegramChatId?: StringNullableFilter<"AgentAccount"> | string | null
    roles?: EnumAgentRoleNullableListFilter<"AgentAccount">
    createdAt?: DateTimeFilter<"AgentAccount"> | Date | string
    updatedAt?: DateTimeFilter<"AgentAccount"> | Date | string
    loginTokens?: LoginTokenListRelationFilter
    audits?: LoginAuditListRelationFilter
  }

  export type AgentAccountOrderByWithRelationInput = {
    userId?: SortOrder
    hashedPin?: SortOrder
    telegramChatId?: SortOrderInput | SortOrder
    roles?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    loginTokens?: LoginTokenOrderByRelationAggregateInput
    audits?: LoginAuditOrderByRelationAggregateInput
  }

  export type AgentAccountWhereUniqueInput = Prisma.AtLeast<{
    userId?: string
    AND?: AgentAccountWhereInput | AgentAccountWhereInput[]
    OR?: AgentAccountWhereInput[]
    NOT?: AgentAccountWhereInput | AgentAccountWhereInput[]
    hashedPin?: StringFilter<"AgentAccount"> | string
    telegramChatId?: StringNullableFilter<"AgentAccount"> | string | null
    roles?: EnumAgentRoleNullableListFilter<"AgentAccount">
    createdAt?: DateTimeFilter<"AgentAccount"> | Date | string
    updatedAt?: DateTimeFilter<"AgentAccount"> | Date | string
    loginTokens?: LoginTokenListRelationFilter
    audits?: LoginAuditListRelationFilter
  }, "userId">

  export type AgentAccountOrderByWithAggregationInput = {
    userId?: SortOrder
    hashedPin?: SortOrder
    telegramChatId?: SortOrderInput | SortOrder
    roles?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AgentAccountCountOrderByAggregateInput
    _max?: AgentAccountMaxOrderByAggregateInput
    _min?: AgentAccountMinOrderByAggregateInput
  }

  export type AgentAccountScalarWhereWithAggregatesInput = {
    AND?: AgentAccountScalarWhereWithAggregatesInput | AgentAccountScalarWhereWithAggregatesInput[]
    OR?: AgentAccountScalarWhereWithAggregatesInput[]
    NOT?: AgentAccountScalarWhereWithAggregatesInput | AgentAccountScalarWhereWithAggregatesInput[]
    userId?: StringWithAggregatesFilter<"AgentAccount"> | string
    hashedPin?: StringWithAggregatesFilter<"AgentAccount"> | string
    telegramChatId?: StringNullableWithAggregatesFilter<"AgentAccount"> | string | null
    roles?: EnumAgentRoleNullableListFilter<"AgentAccount">
    createdAt?: DateTimeWithAggregatesFilter<"AgentAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AgentAccount"> | Date | string
  }

  export type LoginTokenWhereInput = {
    AND?: LoginTokenWhereInput | LoginTokenWhereInput[]
    OR?: LoginTokenWhereInput[]
    NOT?: LoginTokenWhereInput | LoginTokenWhereInput[]
    id?: StringFilter<"LoginToken"> | string
    agentId?: StringFilter<"LoginToken"> | string
    tokenHash?: StringFilter<"LoginToken"> | string
    expiresAt?: DateTimeFilter<"LoginToken"> | Date | string
    consumedAt?: DateTimeNullableFilter<"LoginToken"> | Date | string | null
    createdAt?: DateTimeFilter<"LoginToken"> | Date | string
    agent?: XOR<AgentAccountScalarRelationFilter, AgentAccountWhereInput>
  }

  export type LoginTokenOrderByWithRelationInput = {
    id?: SortOrder
    agentId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    agent?: AgentAccountOrderByWithRelationInput
  }

  export type LoginTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoginTokenWhereInput | LoginTokenWhereInput[]
    OR?: LoginTokenWhereInput[]
    NOT?: LoginTokenWhereInput | LoginTokenWhereInput[]
    agentId?: StringFilter<"LoginToken"> | string
    tokenHash?: StringFilter<"LoginToken"> | string
    expiresAt?: DateTimeFilter<"LoginToken"> | Date | string
    consumedAt?: DateTimeNullableFilter<"LoginToken"> | Date | string | null
    createdAt?: DateTimeFilter<"LoginToken"> | Date | string
    agent?: XOR<AgentAccountScalarRelationFilter, AgentAccountWhereInput>
  }, "id">

  export type LoginTokenOrderByWithAggregationInput = {
    id?: SortOrder
    agentId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LoginTokenCountOrderByAggregateInput
    _max?: LoginTokenMaxOrderByAggregateInput
    _min?: LoginTokenMinOrderByAggregateInput
  }

  export type LoginTokenScalarWhereWithAggregatesInput = {
    AND?: LoginTokenScalarWhereWithAggregatesInput | LoginTokenScalarWhereWithAggregatesInput[]
    OR?: LoginTokenScalarWhereWithAggregatesInput[]
    NOT?: LoginTokenScalarWhereWithAggregatesInput | LoginTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LoginToken"> | string
    agentId?: StringWithAggregatesFilter<"LoginToken"> | string
    tokenHash?: StringWithAggregatesFilter<"LoginToken"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"LoginToken"> | Date | string
    consumedAt?: DateTimeNullableWithAggregatesFilter<"LoginToken"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LoginToken"> | Date | string
  }

  export type LoginAuditWhereInput = {
    AND?: LoginAuditWhereInput | LoginAuditWhereInput[]
    OR?: LoginAuditWhereInput[]
    NOT?: LoginAuditWhereInput | LoginAuditWhereInput[]
    id?: StringFilter<"LoginAudit"> | string
    agentId?: StringFilter<"LoginAudit"> | string
    status?: EnumLoginAuditStatusFilter<"LoginAudit"> | $Enums.LoginAuditStatus
    ip?: StringNullableFilter<"LoginAudit"> | string | null
    userAgent?: StringNullableFilter<"LoginAudit"> | string | null
    note?: StringNullableFilter<"LoginAudit"> | string | null
    createdAt?: DateTimeFilter<"LoginAudit"> | Date | string
    agent?: XOR<AgentAccountScalarRelationFilter, AgentAccountWhereInput>
  }

  export type LoginAuditOrderByWithRelationInput = {
    id?: SortOrder
    agentId?: SortOrder
    status?: SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    agent?: AgentAccountOrderByWithRelationInput
  }

  export type LoginAuditWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoginAuditWhereInput | LoginAuditWhereInput[]
    OR?: LoginAuditWhereInput[]
    NOT?: LoginAuditWhereInput | LoginAuditWhereInput[]
    agentId?: StringFilter<"LoginAudit"> | string
    status?: EnumLoginAuditStatusFilter<"LoginAudit"> | $Enums.LoginAuditStatus
    ip?: StringNullableFilter<"LoginAudit"> | string | null
    userAgent?: StringNullableFilter<"LoginAudit"> | string | null
    note?: StringNullableFilter<"LoginAudit"> | string | null
    createdAt?: DateTimeFilter<"LoginAudit"> | Date | string
    agent?: XOR<AgentAccountScalarRelationFilter, AgentAccountWhereInput>
  }, "id">

  export type LoginAuditOrderByWithAggregationInput = {
    id?: SortOrder
    agentId?: SortOrder
    status?: SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LoginAuditCountOrderByAggregateInput
    _max?: LoginAuditMaxOrderByAggregateInput
    _min?: LoginAuditMinOrderByAggregateInput
  }

  export type LoginAuditScalarWhereWithAggregatesInput = {
    AND?: LoginAuditScalarWhereWithAggregatesInput | LoginAuditScalarWhereWithAggregatesInput[]
    OR?: LoginAuditScalarWhereWithAggregatesInput[]
    NOT?: LoginAuditScalarWhereWithAggregatesInput | LoginAuditScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LoginAudit"> | string
    agentId?: StringWithAggregatesFilter<"LoginAudit"> | string
    status?: EnumLoginAuditStatusWithAggregatesFilter<"LoginAudit"> | $Enums.LoginAuditStatus
    ip?: StringNullableWithAggregatesFilter<"LoginAudit"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"LoginAudit"> | string | null
    note?: StringNullableWithAggregatesFilter<"LoginAudit"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LoginAudit"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    phone?: string | null
    address?: string | null
    longSummary?: string | null
    createdAt?: Date | string
    orders?: OrderCreateNestedManyWithoutUserInput
    sessions?: ChatSessionCreateNestedManyWithoutUserInput
    tickets?: TicketCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    phone?: string | null
    address?: string | null
    longSummary?: string | null
    createdAt?: Date | string
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
    sessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    tickets?: TicketUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    longSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUpdateManyWithoutUserNestedInput
    sessions?: ChatSessionUpdateManyWithoutUserNestedInput
    tickets?: TicketUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    longSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
    sessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    tickets?: TicketUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    phone?: string | null
    address?: string | null
    longSummary?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    longSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    longSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCreateInput = {
    id?: string
    orderId: string
    createdAt?: Date | string
    status?: string | null
    user?: UserCreateNestedOneWithoutOrdersInput
  }

  export type OrderUncheckedCreateInput = {
    id?: string
    userId?: string | null
    orderId: string
    createdAt?: Date | string
    status?: string | null
  }

  export type OrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutOrdersNestedInput
  }

  export type OrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OrderCreateManyInput = {
    id?: string
    userId?: string | null
    orderId: string
    createdAt?: Date | string
    status?: string | null
  }

  export type OrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    orderId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChatSessionCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
    messages: JsonNullValueInput | InputJsonValue
    summary?: string | null
    lastSummarizedIndex?: number
    unsummarizedLimit?: number
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type ChatSessionUncheckedCreateInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
    messages: JsonNullValueInput | InputJsonValue
    summary?: string | null
    lastSummarizedIndex?: number
    unsummarizedLimit?: number
  }

  export type ChatSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: JsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    lastSummarizedIndex?: IntFieldUpdateOperationsInput | number
    unsummarizedLimit?: IntFieldUpdateOperationsInput | number
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type ChatSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: JsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    lastSummarizedIndex?: IntFieldUpdateOperationsInput | number
    unsummarizedLimit?: IntFieldUpdateOperationsInput | number
  }

  export type ChatSessionCreateManyInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
    messages: JsonNullValueInput | InputJsonValue
    summary?: string | null
    lastSummarizedIndex?: number
    unsummarizedLimit?: number
  }

  export type ChatSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: JsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    lastSummarizedIndex?: IntFieldUpdateOperationsInput | number
    unsummarizedLimit?: IntFieldUpdateOperationsInput | number
  }

  export type ChatSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: JsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    lastSummarizedIndex?: IntFieldUpdateOperationsInput | number
    unsummarizedLimit?: IntFieldUpdateOperationsInput | number
  }

  export type TicketCreateInput = {
    id?: string
    ticket: string
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutTicketsInput
  }

  export type TicketUncheckedCreateInput = {
    id?: string
    ticket: string
    createdAt?: Date | string
    userId?: string | null
  }

  export type TicketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticket?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutTicketsNestedInput
  }

  export type TicketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticket?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TicketCreateManyInput = {
    id?: string
    ticket: string
    createdAt?: Date | string
    userId?: string | null
  }

  export type TicketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticket?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticket?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ConversationMessageCreateInput = {
    messageId: number
    conversationId: number
    inboxId: number
    conversationKey: string
    sender: string
    content: string
    createdAt?: Date | string
  }

  export type ConversationMessageUncheckedCreateInput = {
    id?: number
    messageId: number
    conversationId: number
    inboxId: number
    conversationKey: string
    sender: string
    content: string
    createdAt?: Date | string
  }

  export type ConversationMessageUpdateInput = {
    messageId?: IntFieldUpdateOperationsInput | number
    conversationId?: IntFieldUpdateOperationsInput | number
    inboxId?: IntFieldUpdateOperationsInput | number
    conversationKey?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationMessageUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    messageId?: IntFieldUpdateOperationsInput | number
    conversationId?: IntFieldUpdateOperationsInput | number
    inboxId?: IntFieldUpdateOperationsInput | number
    conversationKey?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationMessageCreateManyInput = {
    id?: number
    messageId: number
    conversationId: number
    inboxId: number
    conversationKey: string
    sender: string
    content: string
    createdAt?: Date | string
  }

  export type ConversationMessageUpdateManyMutationInput = {
    messageId?: IntFieldUpdateOperationsInput | number
    conversationId?: IntFieldUpdateOperationsInput | number
    inboxId?: IntFieldUpdateOperationsInput | number
    conversationKey?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationMessageUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    messageId?: IntFieldUpdateOperationsInput | number
    conversationId?: IntFieldUpdateOperationsInput | number
    inboxId?: IntFieldUpdateOperationsInput | number
    conversationKey?: StringFieldUpdateOperationsInput | string
    sender?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentAssignmentCreateInput = {
    inboxId: number
    agentId: number
    lastAssignedAt?: Date | string | null
    activeConversationId?: number | null
    availabilityBeforeBusy?: $Enums.AgentAvailability | null
  }

  export type AgentAssignmentUncheckedCreateInput = {
    inboxId: number
    agentId: number
    lastAssignedAt?: Date | string | null
    activeConversationId?: number | null
    availabilityBeforeBusy?: $Enums.AgentAvailability | null
  }

  export type AgentAssignmentUpdateInput = {
    inboxId?: IntFieldUpdateOperationsInput | number
    agentId?: IntFieldUpdateOperationsInput | number
    lastAssignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activeConversationId?: NullableIntFieldUpdateOperationsInput | number | null
    availabilityBeforeBusy?: NullableEnumAgentAvailabilityFieldUpdateOperationsInput | $Enums.AgentAvailability | null
  }

  export type AgentAssignmentUncheckedUpdateInput = {
    inboxId?: IntFieldUpdateOperationsInput | number
    agentId?: IntFieldUpdateOperationsInput | number
    lastAssignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activeConversationId?: NullableIntFieldUpdateOperationsInput | number | null
    availabilityBeforeBusy?: NullableEnumAgentAvailabilityFieldUpdateOperationsInput | $Enums.AgentAvailability | null
  }

  export type AgentAssignmentCreateManyInput = {
    inboxId: number
    agentId: number
    lastAssignedAt?: Date | string | null
    activeConversationId?: number | null
    availabilityBeforeBusy?: $Enums.AgentAvailability | null
  }

  export type AgentAssignmentUpdateManyMutationInput = {
    inboxId?: IntFieldUpdateOperationsInput | number
    agentId?: IntFieldUpdateOperationsInput | number
    lastAssignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activeConversationId?: NullableIntFieldUpdateOperationsInput | number | null
    availabilityBeforeBusy?: NullableEnumAgentAvailabilityFieldUpdateOperationsInput | $Enums.AgentAvailability | null
  }

  export type AgentAssignmentUncheckedUpdateManyInput = {
    inboxId?: IntFieldUpdateOperationsInput | number
    agentId?: IntFieldUpdateOperationsInput | number
    lastAssignedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activeConversationId?: NullableIntFieldUpdateOperationsInput | number | null
    availabilityBeforeBusy?: NullableEnumAgentAvailabilityFieldUpdateOperationsInput | $Enums.AgentAvailability | null
  }

  export type HandoffRequestCreateInput = {
    conversationKey: string
    conversationId: number
    accountId: number
    inboxId: number
    requestedAt?: Date | string
    status?: $Enums.HandoffRequestStatus
    agentId?: number | null
    lastPositionNotified?: number | null
  }

  export type HandoffRequestUncheckedCreateInput = {
    conversationKey: string
    conversationId: number
    accountId: number
    inboxId: number
    requestedAt?: Date | string
    status?: $Enums.HandoffRequestStatus
    agentId?: number | null
    lastPositionNotified?: number | null
  }

  export type HandoffRequestUpdateInput = {
    conversationKey?: StringFieldUpdateOperationsInput | string
    conversationId?: IntFieldUpdateOperationsInput | number
    accountId?: IntFieldUpdateOperationsInput | number
    inboxId?: IntFieldUpdateOperationsInput | number
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumHandoffRequestStatusFieldUpdateOperationsInput | $Enums.HandoffRequestStatus
    agentId?: NullableIntFieldUpdateOperationsInput | number | null
    lastPositionNotified?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type HandoffRequestUncheckedUpdateInput = {
    conversationKey?: StringFieldUpdateOperationsInput | string
    conversationId?: IntFieldUpdateOperationsInput | number
    accountId?: IntFieldUpdateOperationsInput | number
    inboxId?: IntFieldUpdateOperationsInput | number
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumHandoffRequestStatusFieldUpdateOperationsInput | $Enums.HandoffRequestStatus
    agentId?: NullableIntFieldUpdateOperationsInput | number | null
    lastPositionNotified?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type HandoffRequestCreateManyInput = {
    conversationKey: string
    conversationId: number
    accountId: number
    inboxId: number
    requestedAt?: Date | string
    status?: $Enums.HandoffRequestStatus
    agentId?: number | null
    lastPositionNotified?: number | null
  }

  export type HandoffRequestUpdateManyMutationInput = {
    conversationKey?: StringFieldUpdateOperationsInput | string
    conversationId?: IntFieldUpdateOperationsInput | number
    accountId?: IntFieldUpdateOperationsInput | number
    inboxId?: IntFieldUpdateOperationsInput | number
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumHandoffRequestStatusFieldUpdateOperationsInput | $Enums.HandoffRequestStatus
    agentId?: NullableIntFieldUpdateOperationsInput | number | null
    lastPositionNotified?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type HandoffRequestUncheckedUpdateManyInput = {
    conversationKey?: StringFieldUpdateOperationsInput | string
    conversationId?: IntFieldUpdateOperationsInput | number
    accountId?: IntFieldUpdateOperationsInput | number
    inboxId?: IntFieldUpdateOperationsInput | number
    requestedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumHandoffRequestStatusFieldUpdateOperationsInput | $Enums.HandoffRequestStatus
    agentId?: NullableIntFieldUpdateOperationsInput | number | null
    lastPositionNotified?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ScrapeJobCreateInput = {
    id?: string
    script: string
    args?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ScrapeJobStatus
    cadence?: $Enums.ScrapeJobCadence
    autoRunManualWithNext?: boolean
    paused?: boolean
    progress?: number
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    logPath?: string | null
    nextRunAt?: Date | string | null
    durationSeconds?: number | null
    documentsIngested?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScrapeJobUncheckedCreateInput = {
    id?: string
    script: string
    args?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ScrapeJobStatus
    cadence?: $Enums.ScrapeJobCadence
    autoRunManualWithNext?: boolean
    paused?: boolean
    progress?: number
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    logPath?: string | null
    nextRunAt?: Date | string | null
    durationSeconds?: number | null
    documentsIngested?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScrapeJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    script?: StringFieldUpdateOperationsInput | string
    args?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumScrapeJobStatusFieldUpdateOperationsInput | $Enums.ScrapeJobStatus
    cadence?: EnumScrapeJobCadenceFieldUpdateOperationsInput | $Enums.ScrapeJobCadence
    autoRunManualWithNext?: BoolFieldUpdateOperationsInput | boolean
    paused?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    logPath?: NullableStringFieldUpdateOperationsInput | string | null
    nextRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    documentsIngested?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapeJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    script?: StringFieldUpdateOperationsInput | string
    args?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumScrapeJobStatusFieldUpdateOperationsInput | $Enums.ScrapeJobStatus
    cadence?: EnumScrapeJobCadenceFieldUpdateOperationsInput | $Enums.ScrapeJobCadence
    autoRunManualWithNext?: BoolFieldUpdateOperationsInput | boolean
    paused?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    logPath?: NullableStringFieldUpdateOperationsInput | string | null
    nextRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    documentsIngested?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapeJobCreateManyInput = {
    id?: string
    script: string
    args?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ScrapeJobStatus
    cadence?: $Enums.ScrapeJobCadence
    autoRunManualWithNext?: boolean
    paused?: boolean
    progress?: number
    startedAt?: Date | string | null
    finishedAt?: Date | string | null
    logPath?: string | null
    nextRunAt?: Date | string | null
    durationSeconds?: number | null
    documentsIngested?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScrapeJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    script?: StringFieldUpdateOperationsInput | string
    args?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumScrapeJobStatusFieldUpdateOperationsInput | $Enums.ScrapeJobStatus
    cadence?: EnumScrapeJobCadenceFieldUpdateOperationsInput | $Enums.ScrapeJobCadence
    autoRunManualWithNext?: BoolFieldUpdateOperationsInput | boolean
    paused?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    logPath?: NullableStringFieldUpdateOperationsInput | string | null
    nextRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    documentsIngested?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScrapeJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    script?: StringFieldUpdateOperationsInput | string
    args?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumScrapeJobStatusFieldUpdateOperationsInput | $Enums.ScrapeJobStatus
    cadence?: EnumScrapeJobCadenceFieldUpdateOperationsInput | $Enums.ScrapeJobCadence
    autoRunManualWithNext?: BoolFieldUpdateOperationsInput | boolean
    paused?: BoolFieldUpdateOperationsInput | boolean
    progress?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    logPath?: NullableStringFieldUpdateOperationsInput | string | null
    nextRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    documentsIngested?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentAccountCreateInput = {
    userId: string
    hashedPin: string
    telegramChatId?: string | null
    roles?: AgentAccountCreaterolesInput | $Enums.AgentRole[]
    createdAt?: Date | string
    updatedAt?: Date | string
    loginTokens?: LoginTokenCreateNestedManyWithoutAgentInput
    audits?: LoginAuditCreateNestedManyWithoutAgentInput
  }

  export type AgentAccountUncheckedCreateInput = {
    userId: string
    hashedPin: string
    telegramChatId?: string | null
    roles?: AgentAccountCreaterolesInput | $Enums.AgentRole[]
    createdAt?: Date | string
    updatedAt?: Date | string
    loginTokens?: LoginTokenUncheckedCreateNestedManyWithoutAgentInput
    audits?: LoginAuditUncheckedCreateNestedManyWithoutAgentInput
  }

  export type AgentAccountUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    hashedPin?: StringFieldUpdateOperationsInput | string
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: AgentAccountUpdaterolesInput | $Enums.AgentRole[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    loginTokens?: LoginTokenUpdateManyWithoutAgentNestedInput
    audits?: LoginAuditUpdateManyWithoutAgentNestedInput
  }

  export type AgentAccountUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    hashedPin?: StringFieldUpdateOperationsInput | string
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: AgentAccountUpdaterolesInput | $Enums.AgentRole[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    loginTokens?: LoginTokenUncheckedUpdateManyWithoutAgentNestedInput
    audits?: LoginAuditUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type AgentAccountCreateManyInput = {
    userId: string
    hashedPin: string
    telegramChatId?: string | null
    roles?: AgentAccountCreaterolesInput | $Enums.AgentRole[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentAccountUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    hashedPin?: StringFieldUpdateOperationsInput | string
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: AgentAccountUpdaterolesInput | $Enums.AgentRole[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentAccountUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    hashedPin?: StringFieldUpdateOperationsInput | string
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: AgentAccountUpdaterolesInput | $Enums.AgentRole[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginTokenCreateInput = {
    id?: string
    tokenHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
    agent: AgentAccountCreateNestedOneWithoutLoginTokensInput
  }

  export type LoginTokenUncheckedCreateInput = {
    id?: string
    agentId: string
    tokenHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LoginTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: AgentAccountUpdateOneRequiredWithoutLoginTokensNestedInput
  }

  export type LoginTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginTokenCreateManyInput = {
    id?: string
    agentId: string
    tokenHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LoginTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAuditCreateInput = {
    id?: string
    status: $Enums.LoginAuditStatus
    ip?: string | null
    userAgent?: string | null
    note?: string | null
    createdAt?: Date | string
    agent: AgentAccountCreateNestedOneWithoutAuditsInput
  }

  export type LoginAuditUncheckedCreateInput = {
    id?: string
    agentId: string
    status: $Enums.LoginAuditStatus
    ip?: string | null
    userAgent?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type LoginAuditUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLoginAuditStatusFieldUpdateOperationsInput | $Enums.LoginAuditStatus
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: AgentAccountUpdateOneRequiredWithoutAuditsNestedInput
  }

  export type LoginAuditUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    status?: EnumLoginAuditStatusFieldUpdateOperationsInput | $Enums.LoginAuditStatus
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAuditCreateManyInput = {
    id?: string
    agentId: string
    status: $Enums.LoginAuditStatus
    ip?: string | null
    userAgent?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type LoginAuditUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLoginAuditStatusFieldUpdateOperationsInput | $Enums.LoginAuditStatus
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAuditUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    status?: EnumLoginAuditStatusFieldUpdateOperationsInput | $Enums.LoginAuditStatus
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type OrderListRelationFilter = {
    every?: OrderWhereInput
    some?: OrderWhereInput
    none?: OrderWhereInput
  }

  export type ChatSessionListRelationFilter = {
    every?: ChatSessionWhereInput
    some?: ChatSessionWhereInput
    none?: ChatSessionWhereInput
  }

  export type TicketListRelationFilter = {
    every?: TicketWhereInput
    some?: TicketWhereInput
    none?: TicketWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TicketOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    longSummary?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    longSummary?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    longSummary?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type OrderCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
  }

  export type OrderMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
  }

  export type OrderMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    orderId?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ChatSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    endedAt?: SortOrder
    messages?: SortOrder
    summary?: SortOrder
    lastSummarizedIndex?: SortOrder
    unsummarizedLimit?: SortOrder
  }

  export type ChatSessionAvgOrderByAggregateInput = {
    lastSummarizedIndex?: SortOrder
    unsummarizedLimit?: SortOrder
  }

  export type ChatSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    endedAt?: SortOrder
    summary?: SortOrder
    lastSummarizedIndex?: SortOrder
    unsummarizedLimit?: SortOrder
  }

  export type ChatSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    endedAt?: SortOrder
    summary?: SortOrder
    lastSummarizedIndex?: SortOrder
    unsummarizedLimit?: SortOrder
  }

  export type ChatSessionSumOrderByAggregateInput = {
    lastSummarizedIndex?: SortOrder
    unsummarizedLimit?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type TicketCountOrderByAggregateInput = {
    id?: SortOrder
    ticket?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrder
  }

  export type TicketMaxOrderByAggregateInput = {
    id?: SortOrder
    ticket?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrder
  }

  export type TicketMinOrderByAggregateInput = {
    id?: SortOrder
    ticket?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrder
  }

  export type ConversationMessageConversationKeyMessageIdCompoundUniqueInput = {
    conversationKey: string
    messageId: number
  }

  export type ConversationMessageCountOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    conversationId?: SortOrder
    inboxId?: SortOrder
    conversationKey?: SortOrder
    sender?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type ConversationMessageAvgOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    conversationId?: SortOrder
    inboxId?: SortOrder
  }

  export type ConversationMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    conversationId?: SortOrder
    inboxId?: SortOrder
    conversationKey?: SortOrder
    sender?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type ConversationMessageMinOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    conversationId?: SortOrder
    inboxId?: SortOrder
    conversationKey?: SortOrder
    sender?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type ConversationMessageSumOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    conversationId?: SortOrder
    inboxId?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumAgentAvailabilityNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.AgentAvailability | EnumAgentAvailabilityFieldRefInput<$PrismaModel> | null
    in?: $Enums.AgentAvailability[] | ListEnumAgentAvailabilityFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.AgentAvailability[] | ListEnumAgentAvailabilityFieldRefInput<$PrismaModel> | null
    not?: NestedEnumAgentAvailabilityNullableFilter<$PrismaModel> | $Enums.AgentAvailability | null
  }

  export type AgentAssignmentInboxIdAgentIdCompoundUniqueInput = {
    inboxId: number
    agentId: number
  }

  export type AgentAssignmentCountOrderByAggregateInput = {
    inboxId?: SortOrder
    agentId?: SortOrder
    lastAssignedAt?: SortOrder
    activeConversationId?: SortOrder
    availabilityBeforeBusy?: SortOrder
  }

  export type AgentAssignmentAvgOrderByAggregateInput = {
    inboxId?: SortOrder
    agentId?: SortOrder
    activeConversationId?: SortOrder
  }

  export type AgentAssignmentMaxOrderByAggregateInput = {
    inboxId?: SortOrder
    agentId?: SortOrder
    lastAssignedAt?: SortOrder
    activeConversationId?: SortOrder
    availabilityBeforeBusy?: SortOrder
  }

  export type AgentAssignmentMinOrderByAggregateInput = {
    inboxId?: SortOrder
    agentId?: SortOrder
    lastAssignedAt?: SortOrder
    activeConversationId?: SortOrder
    availabilityBeforeBusy?: SortOrder
  }

  export type AgentAssignmentSumOrderByAggregateInput = {
    inboxId?: SortOrder
    agentId?: SortOrder
    activeConversationId?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumAgentAvailabilityNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AgentAvailability | EnumAgentAvailabilityFieldRefInput<$PrismaModel> | null
    in?: $Enums.AgentAvailability[] | ListEnumAgentAvailabilityFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.AgentAvailability[] | ListEnumAgentAvailabilityFieldRefInput<$PrismaModel> | null
    not?: NestedEnumAgentAvailabilityNullableWithAggregatesFilter<$PrismaModel> | $Enums.AgentAvailability | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumAgentAvailabilityNullableFilter<$PrismaModel>
    _max?: NestedEnumAgentAvailabilityNullableFilter<$PrismaModel>
  }

  export type EnumHandoffRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.HandoffRequestStatus | EnumHandoffRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.HandoffRequestStatus[] | ListEnumHandoffRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.HandoffRequestStatus[] | ListEnumHandoffRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumHandoffRequestStatusFilter<$PrismaModel> | $Enums.HandoffRequestStatus
  }

  export type HandoffRequestCountOrderByAggregateInput = {
    conversationKey?: SortOrder
    conversationId?: SortOrder
    accountId?: SortOrder
    inboxId?: SortOrder
    requestedAt?: SortOrder
    status?: SortOrder
    agentId?: SortOrder
    lastPositionNotified?: SortOrder
  }

  export type HandoffRequestAvgOrderByAggregateInput = {
    conversationId?: SortOrder
    accountId?: SortOrder
    inboxId?: SortOrder
    agentId?: SortOrder
    lastPositionNotified?: SortOrder
  }

  export type HandoffRequestMaxOrderByAggregateInput = {
    conversationKey?: SortOrder
    conversationId?: SortOrder
    accountId?: SortOrder
    inboxId?: SortOrder
    requestedAt?: SortOrder
    status?: SortOrder
    agentId?: SortOrder
    lastPositionNotified?: SortOrder
  }

  export type HandoffRequestMinOrderByAggregateInput = {
    conversationKey?: SortOrder
    conversationId?: SortOrder
    accountId?: SortOrder
    inboxId?: SortOrder
    requestedAt?: SortOrder
    status?: SortOrder
    agentId?: SortOrder
    lastPositionNotified?: SortOrder
  }

  export type HandoffRequestSumOrderByAggregateInput = {
    conversationId?: SortOrder
    accountId?: SortOrder
    inboxId?: SortOrder
    agentId?: SortOrder
    lastPositionNotified?: SortOrder
  }

  export type EnumHandoffRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HandoffRequestStatus | EnumHandoffRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.HandoffRequestStatus[] | ListEnumHandoffRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.HandoffRequestStatus[] | ListEnumHandoffRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumHandoffRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.HandoffRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumHandoffRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumHandoffRequestStatusFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumScrapeJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ScrapeJobStatus | EnumScrapeJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ScrapeJobStatus[] | ListEnumScrapeJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScrapeJobStatus[] | ListEnumScrapeJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumScrapeJobStatusFilter<$PrismaModel> | $Enums.ScrapeJobStatus
  }

  export type EnumScrapeJobCadenceFilter<$PrismaModel = never> = {
    equals?: $Enums.ScrapeJobCadence | EnumScrapeJobCadenceFieldRefInput<$PrismaModel>
    in?: $Enums.ScrapeJobCadence[] | ListEnumScrapeJobCadenceFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScrapeJobCadence[] | ListEnumScrapeJobCadenceFieldRefInput<$PrismaModel>
    not?: NestedEnumScrapeJobCadenceFilter<$PrismaModel> | $Enums.ScrapeJobCadence
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ScrapeJobCountOrderByAggregateInput = {
    id?: SortOrder
    script?: SortOrder
    args?: SortOrder
    status?: SortOrder
    cadence?: SortOrder
    autoRunManualWithNext?: SortOrder
    paused?: SortOrder
    progress?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    logPath?: SortOrder
    nextRunAt?: SortOrder
    durationSeconds?: SortOrder
    documentsIngested?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapeJobAvgOrderByAggregateInput = {
    progress?: SortOrder
    durationSeconds?: SortOrder
    documentsIngested?: SortOrder
  }

  export type ScrapeJobMaxOrderByAggregateInput = {
    id?: SortOrder
    script?: SortOrder
    status?: SortOrder
    cadence?: SortOrder
    autoRunManualWithNext?: SortOrder
    paused?: SortOrder
    progress?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    logPath?: SortOrder
    nextRunAt?: SortOrder
    durationSeconds?: SortOrder
    documentsIngested?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapeJobMinOrderByAggregateInput = {
    id?: SortOrder
    script?: SortOrder
    status?: SortOrder
    cadence?: SortOrder
    autoRunManualWithNext?: SortOrder
    paused?: SortOrder
    progress?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    logPath?: SortOrder
    nextRunAt?: SortOrder
    durationSeconds?: SortOrder
    documentsIngested?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScrapeJobSumOrderByAggregateInput = {
    progress?: SortOrder
    durationSeconds?: SortOrder
    documentsIngested?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumScrapeJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ScrapeJobStatus | EnumScrapeJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ScrapeJobStatus[] | ListEnumScrapeJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScrapeJobStatus[] | ListEnumScrapeJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumScrapeJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.ScrapeJobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumScrapeJobStatusFilter<$PrismaModel>
    _max?: NestedEnumScrapeJobStatusFilter<$PrismaModel>
  }

  export type EnumScrapeJobCadenceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ScrapeJobCadence | EnumScrapeJobCadenceFieldRefInput<$PrismaModel>
    in?: $Enums.ScrapeJobCadence[] | ListEnumScrapeJobCadenceFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScrapeJobCadence[] | ListEnumScrapeJobCadenceFieldRefInput<$PrismaModel>
    not?: NestedEnumScrapeJobCadenceWithAggregatesFilter<$PrismaModel> | $Enums.ScrapeJobCadence
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumScrapeJobCadenceFilter<$PrismaModel>
    _max?: NestedEnumScrapeJobCadenceFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type EnumAgentRoleNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.AgentRole[] | ListEnumAgentRoleFieldRefInput<$PrismaModel> | null
    has?: $Enums.AgentRole | EnumAgentRoleFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.AgentRole[] | ListEnumAgentRoleFieldRefInput<$PrismaModel>
    hasSome?: $Enums.AgentRole[] | ListEnumAgentRoleFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type LoginTokenListRelationFilter = {
    every?: LoginTokenWhereInput
    some?: LoginTokenWhereInput
    none?: LoginTokenWhereInput
  }

  export type LoginAuditListRelationFilter = {
    every?: LoginAuditWhereInput
    some?: LoginAuditWhereInput
    none?: LoginAuditWhereInput
  }

  export type LoginTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LoginAuditOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AgentAccountCountOrderByAggregateInput = {
    userId?: SortOrder
    hashedPin?: SortOrder
    telegramChatId?: SortOrder
    roles?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentAccountMaxOrderByAggregateInput = {
    userId?: SortOrder
    hashedPin?: SortOrder
    telegramChatId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentAccountMinOrderByAggregateInput = {
    userId?: SortOrder
    hashedPin?: SortOrder
    telegramChatId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentAccountScalarRelationFilter = {
    is?: AgentAccountWhereInput
    isNot?: AgentAccountWhereInput
  }

  export type LoginTokenCountOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LoginTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LoginTokenMinOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumLoginAuditStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LoginAuditStatus | EnumLoginAuditStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LoginAuditStatus[] | ListEnumLoginAuditStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LoginAuditStatus[] | ListEnumLoginAuditStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLoginAuditStatusFilter<$PrismaModel> | $Enums.LoginAuditStatus
  }

  export type LoginAuditCountOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    status?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
  }

  export type LoginAuditMaxOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    status?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
  }

  export type LoginAuditMinOrderByAggregateInput = {
    id?: SortOrder
    agentId?: SortOrder
    status?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumLoginAuditStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LoginAuditStatus | EnumLoginAuditStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LoginAuditStatus[] | ListEnumLoginAuditStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LoginAuditStatus[] | ListEnumLoginAuditStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLoginAuditStatusWithAggregatesFilter<$PrismaModel> | $Enums.LoginAuditStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLoginAuditStatusFilter<$PrismaModel>
    _max?: NestedEnumLoginAuditStatusFilter<$PrismaModel>
  }

  export type OrderCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type ChatSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type TicketCreateNestedManyWithoutUserInput = {
    create?: XOR<TicketCreateWithoutUserInput, TicketUncheckedCreateWithoutUserInput> | TicketCreateWithoutUserInput[] | TicketUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutUserInput | TicketCreateOrConnectWithoutUserInput[]
    createMany?: TicketCreateManyUserInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type OrderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
  }

  export type ChatSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type TicketUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TicketCreateWithoutUserInput, TicketUncheckedCreateWithoutUserInput> | TicketCreateWithoutUserInput[] | TicketUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutUserInput | TicketCreateOrConnectWithoutUserInput[]
    createMany?: TicketCreateManyUserInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type OrderUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutUserInput | OrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutUserInput | OrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutUserInput | OrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type ChatSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutUserInput | ChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutUserInput | ChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutUserInput | ChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type TicketUpdateManyWithoutUserNestedInput = {
    create?: XOR<TicketCreateWithoutUserInput, TicketUncheckedCreateWithoutUserInput> | TicketCreateWithoutUserInput[] | TicketUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutUserInput | TicketCreateOrConnectWithoutUserInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutUserInput | TicketUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TicketCreateManyUserInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutUserInput | TicketUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutUserInput | TicketUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type OrderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput> | OrderCreateWithoutUserInput[] | OrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCreateOrConnectWithoutUserInput | OrderCreateOrConnectWithoutUserInput[]
    upsert?: OrderUpsertWithWhereUniqueWithoutUserInput | OrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderCreateManyUserInputEnvelope
    set?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    disconnect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    delete?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    connect?: OrderWhereUniqueInput | OrderWhereUniqueInput[]
    update?: OrderUpdateWithWhereUniqueWithoutUserInput | OrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderUpdateManyWithWhereWithoutUserInput | OrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderScalarWhereInput | OrderScalarWhereInput[]
  }

  export type ChatSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutUserInput | ChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutUserInput | ChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutUserInput | ChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type TicketUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TicketCreateWithoutUserInput, TicketUncheckedCreateWithoutUserInput> | TicketCreateWithoutUserInput[] | TicketUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutUserInput | TicketCreateOrConnectWithoutUserInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutUserInput | TicketUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TicketCreateManyUserInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutUserInput | TicketUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutUserInput | TicketUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutOrdersInput = {
    create?: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutOrdersNestedInput = {
    create?: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrdersInput
    upsert?: UserUpsertWithoutOrdersInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOrdersInput, UserUpdateWithoutOrdersInput>, UserUncheckedUpdateWithoutOrdersInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutTicketsInput = {
    create?: XOR<UserCreateWithoutTicketsInput, UserUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTicketsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutTicketsNestedInput = {
    create?: XOR<UserCreateWithoutTicketsInput, UserUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTicketsInput
    upsert?: UserUpsertWithoutTicketsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTicketsInput, UserUpdateWithoutTicketsInput>, UserUncheckedUpdateWithoutTicketsInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableEnumAgentAvailabilityFieldUpdateOperationsInput = {
    set?: $Enums.AgentAvailability | null
  }

  export type EnumHandoffRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.HandoffRequestStatus
  }

  export type EnumScrapeJobStatusFieldUpdateOperationsInput = {
    set?: $Enums.ScrapeJobStatus
  }

  export type EnumScrapeJobCadenceFieldUpdateOperationsInput = {
    set?: $Enums.ScrapeJobCadence
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AgentAccountCreaterolesInput = {
    set: $Enums.AgentRole[]
  }

  export type LoginTokenCreateNestedManyWithoutAgentInput = {
    create?: XOR<LoginTokenCreateWithoutAgentInput, LoginTokenUncheckedCreateWithoutAgentInput> | LoginTokenCreateWithoutAgentInput[] | LoginTokenUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: LoginTokenCreateOrConnectWithoutAgentInput | LoginTokenCreateOrConnectWithoutAgentInput[]
    createMany?: LoginTokenCreateManyAgentInputEnvelope
    connect?: LoginTokenWhereUniqueInput | LoginTokenWhereUniqueInput[]
  }

  export type LoginAuditCreateNestedManyWithoutAgentInput = {
    create?: XOR<LoginAuditCreateWithoutAgentInput, LoginAuditUncheckedCreateWithoutAgentInput> | LoginAuditCreateWithoutAgentInput[] | LoginAuditUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: LoginAuditCreateOrConnectWithoutAgentInput | LoginAuditCreateOrConnectWithoutAgentInput[]
    createMany?: LoginAuditCreateManyAgentInputEnvelope
    connect?: LoginAuditWhereUniqueInput | LoginAuditWhereUniqueInput[]
  }

  export type LoginTokenUncheckedCreateNestedManyWithoutAgentInput = {
    create?: XOR<LoginTokenCreateWithoutAgentInput, LoginTokenUncheckedCreateWithoutAgentInput> | LoginTokenCreateWithoutAgentInput[] | LoginTokenUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: LoginTokenCreateOrConnectWithoutAgentInput | LoginTokenCreateOrConnectWithoutAgentInput[]
    createMany?: LoginTokenCreateManyAgentInputEnvelope
    connect?: LoginTokenWhereUniqueInput | LoginTokenWhereUniqueInput[]
  }

  export type LoginAuditUncheckedCreateNestedManyWithoutAgentInput = {
    create?: XOR<LoginAuditCreateWithoutAgentInput, LoginAuditUncheckedCreateWithoutAgentInput> | LoginAuditCreateWithoutAgentInput[] | LoginAuditUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: LoginAuditCreateOrConnectWithoutAgentInput | LoginAuditCreateOrConnectWithoutAgentInput[]
    createMany?: LoginAuditCreateManyAgentInputEnvelope
    connect?: LoginAuditWhereUniqueInput | LoginAuditWhereUniqueInput[]
  }

  export type AgentAccountUpdaterolesInput = {
    set?: $Enums.AgentRole[]
    push?: $Enums.AgentRole | $Enums.AgentRole[]
  }

  export type LoginTokenUpdateManyWithoutAgentNestedInput = {
    create?: XOR<LoginTokenCreateWithoutAgentInput, LoginTokenUncheckedCreateWithoutAgentInput> | LoginTokenCreateWithoutAgentInput[] | LoginTokenUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: LoginTokenCreateOrConnectWithoutAgentInput | LoginTokenCreateOrConnectWithoutAgentInput[]
    upsert?: LoginTokenUpsertWithWhereUniqueWithoutAgentInput | LoginTokenUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: LoginTokenCreateManyAgentInputEnvelope
    set?: LoginTokenWhereUniqueInput | LoginTokenWhereUniqueInput[]
    disconnect?: LoginTokenWhereUniqueInput | LoginTokenWhereUniqueInput[]
    delete?: LoginTokenWhereUniqueInput | LoginTokenWhereUniqueInput[]
    connect?: LoginTokenWhereUniqueInput | LoginTokenWhereUniqueInput[]
    update?: LoginTokenUpdateWithWhereUniqueWithoutAgentInput | LoginTokenUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: LoginTokenUpdateManyWithWhereWithoutAgentInput | LoginTokenUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: LoginTokenScalarWhereInput | LoginTokenScalarWhereInput[]
  }

  export type LoginAuditUpdateManyWithoutAgentNestedInput = {
    create?: XOR<LoginAuditCreateWithoutAgentInput, LoginAuditUncheckedCreateWithoutAgentInput> | LoginAuditCreateWithoutAgentInput[] | LoginAuditUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: LoginAuditCreateOrConnectWithoutAgentInput | LoginAuditCreateOrConnectWithoutAgentInput[]
    upsert?: LoginAuditUpsertWithWhereUniqueWithoutAgentInput | LoginAuditUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: LoginAuditCreateManyAgentInputEnvelope
    set?: LoginAuditWhereUniqueInput | LoginAuditWhereUniqueInput[]
    disconnect?: LoginAuditWhereUniqueInput | LoginAuditWhereUniqueInput[]
    delete?: LoginAuditWhereUniqueInput | LoginAuditWhereUniqueInput[]
    connect?: LoginAuditWhereUniqueInput | LoginAuditWhereUniqueInput[]
    update?: LoginAuditUpdateWithWhereUniqueWithoutAgentInput | LoginAuditUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: LoginAuditUpdateManyWithWhereWithoutAgentInput | LoginAuditUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: LoginAuditScalarWhereInput | LoginAuditScalarWhereInput[]
  }

  export type LoginTokenUncheckedUpdateManyWithoutAgentNestedInput = {
    create?: XOR<LoginTokenCreateWithoutAgentInput, LoginTokenUncheckedCreateWithoutAgentInput> | LoginTokenCreateWithoutAgentInput[] | LoginTokenUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: LoginTokenCreateOrConnectWithoutAgentInput | LoginTokenCreateOrConnectWithoutAgentInput[]
    upsert?: LoginTokenUpsertWithWhereUniqueWithoutAgentInput | LoginTokenUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: LoginTokenCreateManyAgentInputEnvelope
    set?: LoginTokenWhereUniqueInput | LoginTokenWhereUniqueInput[]
    disconnect?: LoginTokenWhereUniqueInput | LoginTokenWhereUniqueInput[]
    delete?: LoginTokenWhereUniqueInput | LoginTokenWhereUniqueInput[]
    connect?: LoginTokenWhereUniqueInput | LoginTokenWhereUniqueInput[]
    update?: LoginTokenUpdateWithWhereUniqueWithoutAgentInput | LoginTokenUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: LoginTokenUpdateManyWithWhereWithoutAgentInput | LoginTokenUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: LoginTokenScalarWhereInput | LoginTokenScalarWhereInput[]
  }

  export type LoginAuditUncheckedUpdateManyWithoutAgentNestedInput = {
    create?: XOR<LoginAuditCreateWithoutAgentInput, LoginAuditUncheckedCreateWithoutAgentInput> | LoginAuditCreateWithoutAgentInput[] | LoginAuditUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: LoginAuditCreateOrConnectWithoutAgentInput | LoginAuditCreateOrConnectWithoutAgentInput[]
    upsert?: LoginAuditUpsertWithWhereUniqueWithoutAgentInput | LoginAuditUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: LoginAuditCreateManyAgentInputEnvelope
    set?: LoginAuditWhereUniqueInput | LoginAuditWhereUniqueInput[]
    disconnect?: LoginAuditWhereUniqueInput | LoginAuditWhereUniqueInput[]
    delete?: LoginAuditWhereUniqueInput | LoginAuditWhereUniqueInput[]
    connect?: LoginAuditWhereUniqueInput | LoginAuditWhereUniqueInput[]
    update?: LoginAuditUpdateWithWhereUniqueWithoutAgentInput | LoginAuditUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: LoginAuditUpdateManyWithWhereWithoutAgentInput | LoginAuditUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: LoginAuditScalarWhereInput | LoginAuditScalarWhereInput[]
  }

  export type AgentAccountCreateNestedOneWithoutLoginTokensInput = {
    create?: XOR<AgentAccountCreateWithoutLoginTokensInput, AgentAccountUncheckedCreateWithoutLoginTokensInput>
    connectOrCreate?: AgentAccountCreateOrConnectWithoutLoginTokensInput
    connect?: AgentAccountWhereUniqueInput
  }

  export type AgentAccountUpdateOneRequiredWithoutLoginTokensNestedInput = {
    create?: XOR<AgentAccountCreateWithoutLoginTokensInput, AgentAccountUncheckedCreateWithoutLoginTokensInput>
    connectOrCreate?: AgentAccountCreateOrConnectWithoutLoginTokensInput
    upsert?: AgentAccountUpsertWithoutLoginTokensInput
    connect?: AgentAccountWhereUniqueInput
    update?: XOR<XOR<AgentAccountUpdateToOneWithWhereWithoutLoginTokensInput, AgentAccountUpdateWithoutLoginTokensInput>, AgentAccountUncheckedUpdateWithoutLoginTokensInput>
  }

  export type AgentAccountCreateNestedOneWithoutAuditsInput = {
    create?: XOR<AgentAccountCreateWithoutAuditsInput, AgentAccountUncheckedCreateWithoutAuditsInput>
    connectOrCreate?: AgentAccountCreateOrConnectWithoutAuditsInput
    connect?: AgentAccountWhereUniqueInput
  }

  export type EnumLoginAuditStatusFieldUpdateOperationsInput = {
    set?: $Enums.LoginAuditStatus
  }

  export type AgentAccountUpdateOneRequiredWithoutAuditsNestedInput = {
    create?: XOR<AgentAccountCreateWithoutAuditsInput, AgentAccountUncheckedCreateWithoutAuditsInput>
    connectOrCreate?: AgentAccountCreateOrConnectWithoutAuditsInput
    upsert?: AgentAccountUpsertWithoutAuditsInput
    connect?: AgentAccountWhereUniqueInput
    update?: XOR<XOR<AgentAccountUpdateToOneWithWhereWithoutAuditsInput, AgentAccountUpdateWithoutAuditsInput>, AgentAccountUncheckedUpdateWithoutAuditsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumAgentAvailabilityNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.AgentAvailability | EnumAgentAvailabilityFieldRefInput<$PrismaModel> | null
    in?: $Enums.AgentAvailability[] | ListEnumAgentAvailabilityFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.AgentAvailability[] | ListEnumAgentAvailabilityFieldRefInput<$PrismaModel> | null
    not?: NestedEnumAgentAvailabilityNullableFilter<$PrismaModel> | $Enums.AgentAvailability | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumAgentAvailabilityNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AgentAvailability | EnumAgentAvailabilityFieldRefInput<$PrismaModel> | null
    in?: $Enums.AgentAvailability[] | ListEnumAgentAvailabilityFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.AgentAvailability[] | ListEnumAgentAvailabilityFieldRefInput<$PrismaModel> | null
    not?: NestedEnumAgentAvailabilityNullableWithAggregatesFilter<$PrismaModel> | $Enums.AgentAvailability | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumAgentAvailabilityNullableFilter<$PrismaModel>
    _max?: NestedEnumAgentAvailabilityNullableFilter<$PrismaModel>
  }

  export type NestedEnumHandoffRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.HandoffRequestStatus | EnumHandoffRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.HandoffRequestStatus[] | ListEnumHandoffRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.HandoffRequestStatus[] | ListEnumHandoffRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumHandoffRequestStatusFilter<$PrismaModel> | $Enums.HandoffRequestStatus
  }

  export type NestedEnumHandoffRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HandoffRequestStatus | EnumHandoffRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.HandoffRequestStatus[] | ListEnumHandoffRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.HandoffRequestStatus[] | ListEnumHandoffRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumHandoffRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.HandoffRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumHandoffRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumHandoffRequestStatusFilter<$PrismaModel>
  }

  export type NestedEnumScrapeJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ScrapeJobStatus | EnumScrapeJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ScrapeJobStatus[] | ListEnumScrapeJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScrapeJobStatus[] | ListEnumScrapeJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumScrapeJobStatusFilter<$PrismaModel> | $Enums.ScrapeJobStatus
  }

  export type NestedEnumScrapeJobCadenceFilter<$PrismaModel = never> = {
    equals?: $Enums.ScrapeJobCadence | EnumScrapeJobCadenceFieldRefInput<$PrismaModel>
    in?: $Enums.ScrapeJobCadence[] | ListEnumScrapeJobCadenceFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScrapeJobCadence[] | ListEnumScrapeJobCadenceFieldRefInput<$PrismaModel>
    not?: NestedEnumScrapeJobCadenceFilter<$PrismaModel> | $Enums.ScrapeJobCadence
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumScrapeJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ScrapeJobStatus | EnumScrapeJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ScrapeJobStatus[] | ListEnumScrapeJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScrapeJobStatus[] | ListEnumScrapeJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumScrapeJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.ScrapeJobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumScrapeJobStatusFilter<$PrismaModel>
    _max?: NestedEnumScrapeJobStatusFilter<$PrismaModel>
  }

  export type NestedEnumScrapeJobCadenceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ScrapeJobCadence | EnumScrapeJobCadenceFieldRefInput<$PrismaModel>
    in?: $Enums.ScrapeJobCadence[] | ListEnumScrapeJobCadenceFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScrapeJobCadence[] | ListEnumScrapeJobCadenceFieldRefInput<$PrismaModel>
    not?: NestedEnumScrapeJobCadenceWithAggregatesFilter<$PrismaModel> | $Enums.ScrapeJobCadence
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumScrapeJobCadenceFilter<$PrismaModel>
    _max?: NestedEnumScrapeJobCadenceFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumLoginAuditStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LoginAuditStatus | EnumLoginAuditStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LoginAuditStatus[] | ListEnumLoginAuditStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LoginAuditStatus[] | ListEnumLoginAuditStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLoginAuditStatusFilter<$PrismaModel> | $Enums.LoginAuditStatus
  }

  export type NestedEnumLoginAuditStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LoginAuditStatus | EnumLoginAuditStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LoginAuditStatus[] | ListEnumLoginAuditStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LoginAuditStatus[] | ListEnumLoginAuditStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLoginAuditStatusWithAggregatesFilter<$PrismaModel> | $Enums.LoginAuditStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLoginAuditStatusFilter<$PrismaModel>
    _max?: NestedEnumLoginAuditStatusFilter<$PrismaModel>
  }

  export type OrderCreateWithoutUserInput = {
    id?: string
    orderId: string
    createdAt?: Date | string
    status?: string | null
  }

  export type OrderUncheckedCreateWithoutUserInput = {
    id?: string
    orderId: string
    createdAt?: Date | string
    status?: string | null
  }

  export type OrderCreateOrConnectWithoutUserInput = {
    where: OrderWhereUniqueInput
    create: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput>
  }

  export type OrderCreateManyUserInputEnvelope = {
    data: OrderCreateManyUserInput | OrderCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ChatSessionCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
    messages: JsonNullValueInput | InputJsonValue
    summary?: string | null
    lastSummarizedIndex?: number
    unsummarizedLimit?: number
  }

  export type ChatSessionUncheckedCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
    messages: JsonNullValueInput | InputJsonValue
    summary?: string | null
    lastSummarizedIndex?: number
    unsummarizedLimit?: number
  }

  export type ChatSessionCreateOrConnectWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput>
  }

  export type ChatSessionCreateManyUserInputEnvelope = {
    data: ChatSessionCreateManyUserInput | ChatSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TicketCreateWithoutUserInput = {
    id?: string
    ticket: string
    createdAt?: Date | string
  }

  export type TicketUncheckedCreateWithoutUserInput = {
    id?: string
    ticket: string
    createdAt?: Date | string
  }

  export type TicketCreateOrConnectWithoutUserInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutUserInput, TicketUncheckedCreateWithoutUserInput>
  }

  export type TicketCreateManyUserInputEnvelope = {
    data: TicketCreateManyUserInput | TicketCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type OrderUpsertWithWhereUniqueWithoutUserInput = {
    where: OrderWhereUniqueInput
    update: XOR<OrderUpdateWithoutUserInput, OrderUncheckedUpdateWithoutUserInput>
    create: XOR<OrderCreateWithoutUserInput, OrderUncheckedCreateWithoutUserInput>
  }

  export type OrderUpdateWithWhereUniqueWithoutUserInput = {
    where: OrderWhereUniqueInput
    data: XOR<OrderUpdateWithoutUserInput, OrderUncheckedUpdateWithoutUserInput>
  }

  export type OrderUpdateManyWithWhereWithoutUserInput = {
    where: OrderScalarWhereInput
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyWithoutUserInput>
  }

  export type OrderScalarWhereInput = {
    AND?: OrderScalarWhereInput | OrderScalarWhereInput[]
    OR?: OrderScalarWhereInput[]
    NOT?: OrderScalarWhereInput | OrderScalarWhereInput[]
    id?: StringFilter<"Order"> | string
    userId?: StringNullableFilter<"Order"> | string | null
    orderId?: StringFilter<"Order"> | string
    createdAt?: DateTimeFilter<"Order"> | Date | string
    status?: StringNullableFilter<"Order"> | string | null
  }

  export type ChatSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    update: XOR<ChatSessionUpdateWithoutUserInput, ChatSessionUncheckedUpdateWithoutUserInput>
    create: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput>
  }

  export type ChatSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    data: XOR<ChatSessionUpdateWithoutUserInput, ChatSessionUncheckedUpdateWithoutUserInput>
  }

  export type ChatSessionUpdateManyWithWhereWithoutUserInput = {
    where: ChatSessionScalarWhereInput
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type ChatSessionScalarWhereInput = {
    AND?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
    OR?: ChatSessionScalarWhereInput[]
    NOT?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
    id?: StringFilter<"ChatSession"> | string
    userId?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"ChatSession"> | Date | string | null
    messages?: JsonFilter<"ChatSession">
    summary?: StringNullableFilter<"ChatSession"> | string | null
    lastSummarizedIndex?: IntFilter<"ChatSession"> | number
    unsummarizedLimit?: IntFilter<"ChatSession"> | number
  }

  export type TicketUpsertWithWhereUniqueWithoutUserInput = {
    where: TicketWhereUniqueInput
    update: XOR<TicketUpdateWithoutUserInput, TicketUncheckedUpdateWithoutUserInput>
    create: XOR<TicketCreateWithoutUserInput, TicketUncheckedCreateWithoutUserInput>
  }

  export type TicketUpdateWithWhereUniqueWithoutUserInput = {
    where: TicketWhereUniqueInput
    data: XOR<TicketUpdateWithoutUserInput, TicketUncheckedUpdateWithoutUserInput>
  }

  export type TicketUpdateManyWithWhereWithoutUserInput = {
    where: TicketScalarWhereInput
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyWithoutUserInput>
  }

  export type TicketScalarWhereInput = {
    AND?: TicketScalarWhereInput | TicketScalarWhereInput[]
    OR?: TicketScalarWhereInput[]
    NOT?: TicketScalarWhereInput | TicketScalarWhereInput[]
    id?: StringFilter<"Ticket"> | string
    ticket?: StringFilter<"Ticket"> | string
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    userId?: StringNullableFilter<"Ticket"> | string | null
  }

  export type UserCreateWithoutOrdersInput = {
    id?: string
    email: string
    name?: string | null
    phone?: string | null
    address?: string | null
    longSummary?: string | null
    createdAt?: Date | string
    sessions?: ChatSessionCreateNestedManyWithoutUserInput
    tickets?: TicketCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrdersInput = {
    id?: string
    email: string
    name?: string | null
    phone?: string | null
    address?: string | null
    longSummary?: string | null
    createdAt?: Date | string
    sessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    tickets?: TicketUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrdersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
  }

  export type UserUpsertWithoutOrdersInput = {
    update: XOR<UserUpdateWithoutOrdersInput, UserUncheckedUpdateWithoutOrdersInput>
    create: XOR<UserCreateWithoutOrdersInput, UserUncheckedCreateWithoutOrdersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOrdersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOrdersInput, UserUncheckedUpdateWithoutOrdersInput>
  }

  export type UserUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    longSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: ChatSessionUpdateManyWithoutUserNestedInput
    tickets?: TicketUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    longSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    tickets?: TicketUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    name?: string | null
    phone?: string | null
    address?: string | null
    longSummary?: string | null
    createdAt?: Date | string
    orders?: OrderCreateNestedManyWithoutUserInput
    tickets?: TicketCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    name?: string | null
    phone?: string | null
    address?: string | null
    longSummary?: string | null
    createdAt?: Date | string
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
    tickets?: TicketUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    longSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUpdateManyWithoutUserNestedInput
    tickets?: TicketUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    longSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
    tickets?: TicketUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutTicketsInput = {
    id?: string
    email: string
    name?: string | null
    phone?: string | null
    address?: string | null
    longSummary?: string | null
    createdAt?: Date | string
    orders?: OrderCreateNestedManyWithoutUserInput
    sessions?: ChatSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTicketsInput = {
    id?: string
    email: string
    name?: string | null
    phone?: string | null
    address?: string | null
    longSummary?: string | null
    createdAt?: Date | string
    orders?: OrderUncheckedCreateNestedManyWithoutUserInput
    sessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTicketsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTicketsInput, UserUncheckedCreateWithoutTicketsInput>
  }

  export type UserUpsertWithoutTicketsInput = {
    update: XOR<UserUpdateWithoutTicketsInput, UserUncheckedUpdateWithoutTicketsInput>
    create: XOR<UserCreateWithoutTicketsInput, UserUncheckedCreateWithoutTicketsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTicketsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTicketsInput, UserUncheckedUpdateWithoutTicketsInput>
  }

  export type UserUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    longSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUpdateManyWithoutUserNestedInput
    sessions?: ChatSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    longSummary?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: OrderUncheckedUpdateManyWithoutUserNestedInput
    sessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LoginTokenCreateWithoutAgentInput = {
    id?: string
    tokenHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LoginTokenUncheckedCreateWithoutAgentInput = {
    id?: string
    tokenHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LoginTokenCreateOrConnectWithoutAgentInput = {
    where: LoginTokenWhereUniqueInput
    create: XOR<LoginTokenCreateWithoutAgentInput, LoginTokenUncheckedCreateWithoutAgentInput>
  }

  export type LoginTokenCreateManyAgentInputEnvelope = {
    data: LoginTokenCreateManyAgentInput | LoginTokenCreateManyAgentInput[]
    skipDuplicates?: boolean
  }

  export type LoginAuditCreateWithoutAgentInput = {
    id?: string
    status: $Enums.LoginAuditStatus
    ip?: string | null
    userAgent?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type LoginAuditUncheckedCreateWithoutAgentInput = {
    id?: string
    status: $Enums.LoginAuditStatus
    ip?: string | null
    userAgent?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type LoginAuditCreateOrConnectWithoutAgentInput = {
    where: LoginAuditWhereUniqueInput
    create: XOR<LoginAuditCreateWithoutAgentInput, LoginAuditUncheckedCreateWithoutAgentInput>
  }

  export type LoginAuditCreateManyAgentInputEnvelope = {
    data: LoginAuditCreateManyAgentInput | LoginAuditCreateManyAgentInput[]
    skipDuplicates?: boolean
  }

  export type LoginTokenUpsertWithWhereUniqueWithoutAgentInput = {
    where: LoginTokenWhereUniqueInput
    update: XOR<LoginTokenUpdateWithoutAgentInput, LoginTokenUncheckedUpdateWithoutAgentInput>
    create: XOR<LoginTokenCreateWithoutAgentInput, LoginTokenUncheckedCreateWithoutAgentInput>
  }

  export type LoginTokenUpdateWithWhereUniqueWithoutAgentInput = {
    where: LoginTokenWhereUniqueInput
    data: XOR<LoginTokenUpdateWithoutAgentInput, LoginTokenUncheckedUpdateWithoutAgentInput>
  }

  export type LoginTokenUpdateManyWithWhereWithoutAgentInput = {
    where: LoginTokenScalarWhereInput
    data: XOR<LoginTokenUpdateManyMutationInput, LoginTokenUncheckedUpdateManyWithoutAgentInput>
  }

  export type LoginTokenScalarWhereInput = {
    AND?: LoginTokenScalarWhereInput | LoginTokenScalarWhereInput[]
    OR?: LoginTokenScalarWhereInput[]
    NOT?: LoginTokenScalarWhereInput | LoginTokenScalarWhereInput[]
    id?: StringFilter<"LoginToken"> | string
    agentId?: StringFilter<"LoginToken"> | string
    tokenHash?: StringFilter<"LoginToken"> | string
    expiresAt?: DateTimeFilter<"LoginToken"> | Date | string
    consumedAt?: DateTimeNullableFilter<"LoginToken"> | Date | string | null
    createdAt?: DateTimeFilter<"LoginToken"> | Date | string
  }

  export type LoginAuditUpsertWithWhereUniqueWithoutAgentInput = {
    where: LoginAuditWhereUniqueInput
    update: XOR<LoginAuditUpdateWithoutAgentInput, LoginAuditUncheckedUpdateWithoutAgentInput>
    create: XOR<LoginAuditCreateWithoutAgentInput, LoginAuditUncheckedCreateWithoutAgentInput>
  }

  export type LoginAuditUpdateWithWhereUniqueWithoutAgentInput = {
    where: LoginAuditWhereUniqueInput
    data: XOR<LoginAuditUpdateWithoutAgentInput, LoginAuditUncheckedUpdateWithoutAgentInput>
  }

  export type LoginAuditUpdateManyWithWhereWithoutAgentInput = {
    where: LoginAuditScalarWhereInput
    data: XOR<LoginAuditUpdateManyMutationInput, LoginAuditUncheckedUpdateManyWithoutAgentInput>
  }

  export type LoginAuditScalarWhereInput = {
    AND?: LoginAuditScalarWhereInput | LoginAuditScalarWhereInput[]
    OR?: LoginAuditScalarWhereInput[]
    NOT?: LoginAuditScalarWhereInput | LoginAuditScalarWhereInput[]
    id?: StringFilter<"LoginAudit"> | string
    agentId?: StringFilter<"LoginAudit"> | string
    status?: EnumLoginAuditStatusFilter<"LoginAudit"> | $Enums.LoginAuditStatus
    ip?: StringNullableFilter<"LoginAudit"> | string | null
    userAgent?: StringNullableFilter<"LoginAudit"> | string | null
    note?: StringNullableFilter<"LoginAudit"> | string | null
    createdAt?: DateTimeFilter<"LoginAudit"> | Date | string
  }

  export type AgentAccountCreateWithoutLoginTokensInput = {
    userId: string
    hashedPin: string
    telegramChatId?: string | null
    roles?: AgentAccountCreaterolesInput | $Enums.AgentRole[]
    createdAt?: Date | string
    updatedAt?: Date | string
    audits?: LoginAuditCreateNestedManyWithoutAgentInput
  }

  export type AgentAccountUncheckedCreateWithoutLoginTokensInput = {
    userId: string
    hashedPin: string
    telegramChatId?: string | null
    roles?: AgentAccountCreaterolesInput | $Enums.AgentRole[]
    createdAt?: Date | string
    updatedAt?: Date | string
    audits?: LoginAuditUncheckedCreateNestedManyWithoutAgentInput
  }

  export type AgentAccountCreateOrConnectWithoutLoginTokensInput = {
    where: AgentAccountWhereUniqueInput
    create: XOR<AgentAccountCreateWithoutLoginTokensInput, AgentAccountUncheckedCreateWithoutLoginTokensInput>
  }

  export type AgentAccountUpsertWithoutLoginTokensInput = {
    update: XOR<AgentAccountUpdateWithoutLoginTokensInput, AgentAccountUncheckedUpdateWithoutLoginTokensInput>
    create: XOR<AgentAccountCreateWithoutLoginTokensInput, AgentAccountUncheckedCreateWithoutLoginTokensInput>
    where?: AgentAccountWhereInput
  }

  export type AgentAccountUpdateToOneWithWhereWithoutLoginTokensInput = {
    where?: AgentAccountWhereInput
    data: XOR<AgentAccountUpdateWithoutLoginTokensInput, AgentAccountUncheckedUpdateWithoutLoginTokensInput>
  }

  export type AgentAccountUpdateWithoutLoginTokensInput = {
    userId?: StringFieldUpdateOperationsInput | string
    hashedPin?: StringFieldUpdateOperationsInput | string
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: AgentAccountUpdaterolesInput | $Enums.AgentRole[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audits?: LoginAuditUpdateManyWithoutAgentNestedInput
  }

  export type AgentAccountUncheckedUpdateWithoutLoginTokensInput = {
    userId?: StringFieldUpdateOperationsInput | string
    hashedPin?: StringFieldUpdateOperationsInput | string
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: AgentAccountUpdaterolesInput | $Enums.AgentRole[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audits?: LoginAuditUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type AgentAccountCreateWithoutAuditsInput = {
    userId: string
    hashedPin: string
    telegramChatId?: string | null
    roles?: AgentAccountCreaterolesInput | $Enums.AgentRole[]
    createdAt?: Date | string
    updatedAt?: Date | string
    loginTokens?: LoginTokenCreateNestedManyWithoutAgentInput
  }

  export type AgentAccountUncheckedCreateWithoutAuditsInput = {
    userId: string
    hashedPin: string
    telegramChatId?: string | null
    roles?: AgentAccountCreaterolesInput | $Enums.AgentRole[]
    createdAt?: Date | string
    updatedAt?: Date | string
    loginTokens?: LoginTokenUncheckedCreateNestedManyWithoutAgentInput
  }

  export type AgentAccountCreateOrConnectWithoutAuditsInput = {
    where: AgentAccountWhereUniqueInput
    create: XOR<AgentAccountCreateWithoutAuditsInput, AgentAccountUncheckedCreateWithoutAuditsInput>
  }

  export type AgentAccountUpsertWithoutAuditsInput = {
    update: XOR<AgentAccountUpdateWithoutAuditsInput, AgentAccountUncheckedUpdateWithoutAuditsInput>
    create: XOR<AgentAccountCreateWithoutAuditsInput, AgentAccountUncheckedCreateWithoutAuditsInput>
    where?: AgentAccountWhereInput
  }

  export type AgentAccountUpdateToOneWithWhereWithoutAuditsInput = {
    where?: AgentAccountWhereInput
    data: XOR<AgentAccountUpdateWithoutAuditsInput, AgentAccountUncheckedUpdateWithoutAuditsInput>
  }

  export type AgentAccountUpdateWithoutAuditsInput = {
    userId?: StringFieldUpdateOperationsInput | string
    hashedPin?: StringFieldUpdateOperationsInput | string
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: AgentAccountUpdaterolesInput | $Enums.AgentRole[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    loginTokens?: LoginTokenUpdateManyWithoutAgentNestedInput
  }

  export type AgentAccountUncheckedUpdateWithoutAuditsInput = {
    userId?: StringFieldUpdateOperationsInput | string
    hashedPin?: StringFieldUpdateOperationsInput | string
    telegramChatId?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: AgentAccountUpdaterolesInput | $Enums.AgentRole[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    loginTokens?: LoginTokenUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type OrderCreateManyUserInput = {
    id?: string
    orderId: string
    createdAt?: Date | string
    status?: string | null
  }

  export type ChatSessionCreateManyUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
    messages: JsonNullValueInput | InputJsonValue
    summary?: string | null
    lastSummarizedIndex?: number
    unsummarizedLimit?: number
  }

  export type TicketCreateManyUserInput = {
    id?: string
    ticket: string
    createdAt?: Date | string
  }

  export type OrderUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OrderUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OrderUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChatSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: JsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    lastSummarizedIndex?: IntFieldUpdateOperationsInput | number
    unsummarizedLimit?: IntFieldUpdateOperationsInput | number
  }

  export type ChatSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: JsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    lastSummarizedIndex?: IntFieldUpdateOperationsInput | number
    unsummarizedLimit?: IntFieldUpdateOperationsInput | number
  }

  export type ChatSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: JsonNullValueInput | InputJsonValue
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    lastSummarizedIndex?: IntFieldUpdateOperationsInput | number
    unsummarizedLimit?: IntFieldUpdateOperationsInput | number
  }

  export type TicketUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticket?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticket?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticket?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginTokenCreateManyAgentInput = {
    id?: string
    tokenHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LoginAuditCreateManyAgentInput = {
    id?: string
    status: $Enums.LoginAuditStatus
    ip?: string | null
    userAgent?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type LoginTokenUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginTokenUncheckedUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginTokenUncheckedUpdateManyWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAuditUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLoginAuditStatusFieldUpdateOperationsInput | $Enums.LoginAuditStatus
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAuditUncheckedUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLoginAuditStatusFieldUpdateOperationsInput | $Enums.LoginAuditStatus
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAuditUncheckedUpdateManyWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLoginAuditStatusFieldUpdateOperationsInput | $Enums.LoginAuditStatus
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}