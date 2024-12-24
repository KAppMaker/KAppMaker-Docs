---
sidebar_position: 6
---

# Local Storage

KAppMaker supports **Local Storage** using [**Room**](https://developer.android.com/training/data-storage/room) for offline data storage and retrieval. 

## Database Configuration
The `AppDatabase` is pre-configured for both platforms and located in `data/source/local`. The database name is defined as: (located in `Constants`):
```kotlin
const val LOCAL_DB_STORAGE_NAME = "local_storage.db"
```

## Creating an Entity and DAO

### Create Your Entity
Entities represent tables within the database. Below is an example `UserEntity`, representing a `user` table:

```kotlin
@Entity(tableName = "user")
data class UserEntity(
    @PrimaryKey val id: Int = 0,
    @ColumnInfo("name") val name: String? = null,
)
```

### Define Your DAO
DAOs (Data Access Objects) define database operations. Below is an example `UserDao`:

```kotlin
@Dao
interface UserDao {
    
    @Query("SELECT * FROM user")
    fun getAllFlow(): Flow<List<UserEntity>>
    
    @Upsert
    suspend fun upsert(userEntity: UserEntity)
    
    @Delete
    suspend fun delete(userEntity: UserEntity)
}
```

Then, include your new DAO in the `AppDatabase` class:

```kotlin
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    // Add other DAOs here
}

```

For additional code examples, you can refer to `ExampleEntity` and `ExampleDao`, which contain more functions that you can copy and paste to quickly set up other entities and DAOs.

### Accessing DAOs in Your Project
To use DAOs within your application, you have two main options:

1. **Directly Passing `AppDatabase`**: You can pass an instance of `AppDatabase` where needed and access the DAO directly, e.g., `appDatabase.userDao()`.

2. **Injecting DAOs Directly (Recommended)**: It's generally best practice to inject individual DAOs rather than passing the entire database instance. This keeps different tables separate and provides better modularity.

#### Example of Injecting `UserDao`

To inject `UserDao`, add it to your Dependency Injection (DI) setup:

```kotlin
single { get<AppDatabase>().userDao() }
```

For more details on setting up Dependency Injection, see the [DI Setup](../architecture/di).

