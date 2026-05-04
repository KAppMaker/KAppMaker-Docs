---
sidebar_position: 6
---

# Local Storage

KAppMaker uses [**Room 3**](https://developer.android.com/jetpack/androidx/releases/room3) for offline data persistence. With Room 3 the same `@Database`, `@Entity` and `@Dao` declarations live in `commonMain` and run on **Android, iOS, JVM Desktop, and Web (WASM)** — no per-platform abstraction layer is needed.

## Database Configuration

`AppDatabase` is defined in `shared/src/commonMain/kotlin/.../data/source/local/AppDatabase.kt`. The database file name is exposed via `Constants`:

```kotlin
const val LOCAL_DB_STORAGE_NAME = "local_storage.db"
```

Each platform supplies its own `DatabaseProvider` actual which picks the appropriate `SQLiteDriver`:

| Platform | Driver | Storage |
|---|---|---|
| Android | `BundledSQLiteDriver` | App-private DB file (`getDatabasePath(...)`) |
| iOS | `BundledSQLiteDriver` | NSDocumentDirectory |
| JVM Desktop | `BundledSQLiteDriver` | `java.io.tmpdir` |
| Web (wasmJs + js) | `WebWorkerSQLiteDriver` | OPFS (Origin Private File System), via a Web Worker |

The wasmJs and js drivers share the same [worker.js](https://github.com/) and OPFS storage path; they only differ in how Kotlin constructs the `Worker` (`@JsFun` for wasmJs, `js("…")` for js).

## Creating an Entity and DAO

The fastest way is the [`make_local.sh`](./scripts.md#create-local-data-layer) script — it scaffolds the entity, mappers, DAO, and wires them into `AppDatabase` + Koin in one command.

If you'd rather write it by hand:

### Entity (commonMain)

```kotlin
@Entity(tableName = "user")
data class UserEntity(
    @PrimaryKey @ColumnInfo("id") val id: String,
    @ColumnInfo("name") val name: String? = null,
)

fun UserEntity.toModel(): User = User(id = id, name = name)
fun User.toEntity(): UserEntity = UserEntity(id = id, name = name)
```

> Use `androidx.room3.*` annotations — **not** `androidx.room.*` (that's Room 2.x and is incompatible).

### DAO (commonMain)

```kotlin
@Dao
interface UserDao {
    @Query("SELECT * FROM user")
    fun getAllFlow(): Flow<List<UserEntity>>

    @Upsert
    suspend fun upsert(entity: UserEntity)

    @Delete
    suspend fun delete(entity: UserEntity)
}
```

All DAO functions must be `suspend` or return a reactive type (`Flow`) — Room 3 no longer permits blocking DAO calls.

### Register on `AppDatabase`

Add the entity to the `@Database(entities = [...])` list and expose a DAO accessor:

```kotlin
@Database(
    entities = [GenerationOutputEntity::class, /* ... */ UserEntity::class],
    version = 1,
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    // Add new DAOs above — make_local.sh inserts here.
}
```

### Wire into Koin (commonMain)

In `data/source/local/DatabaseModule.kt`:

```kotlin
single { get<AppDatabase>().userDao() }
```

Then inject the DAO directly into your repository:

```kotlin
class UserRepository(private val userDao: UserDao) {
    fun observeUsers(): Flow<List<User>> = userDao.getAllFlow().map { it.map { e -> e.toModel() } }

    suspend fun save(user: User) = userDao.upsert(user.toEntity())
}
```

Refer to `ExampleEntity` / `ExampleDao` for a working template.
