import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SERVERIP } from '../config'
import { api } from '@/utils/api'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Input
} from '@nextui-org/react'
const AddDropVolunteer = () => {
  const [users, setUsers] = useState([])
  const [roleFilter, setRoleFilter] = useState([
    'admin',
    'volunteer',
    'movievolunteer',
    'ticketvolunteer',
    'standard'
  ])
  const [filterValue, setFilterValue] = useState('')
  const navigate = useNavigate()
  // const onSearchChange = React.useCallback((value) => {
  // 	if (value) {
  // 		setFilterValue(value)
  // 	} else {
  // 		setFilterValue('')
  // 	}
  // }, [])

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType')
    if (!storedUserType || storedUserType !== 'admin') {
      navigate('/')
    } else {
      ;(async () => {
        try {
          let url = new URL(`/user/fetchusers`)
          if (filterValue) {
            url.searchParams.append('search', filterValue)
          }
          if (roleFilter.length > 0) {
            roleFilter.forEach((role) => {
              url.searchParams.append('role', role)
            })
          }
          console.log(url.toString())
          const response = await api.get(url.toString())
          if (response.status !== 200) {
            throw new Error('Failed to fetch user data')
          }
          const data = response.data
          setUsers(data.users)
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      })()
      sortUsers()
    }
  }, [navigate])

  const sortUsers = async () => {
    const sortedUsers = users.sort((a, b) => {
      const userTypeOrder = {
        admin: 0,
        volunteer: 1,
        movievolunteer: 2,
        ticketvolunteer: 3,
        standard: 4
      }

      const userTypeA = a.usertype.toLowerCase()
      const userTypeB = b.usertype.toLowerCase()

      // Sort by userType first
      if (userTypeOrder[userTypeA] < userTypeOrder[userTypeB]) return -1
      if (userTypeOrder[userTypeA] > userTypeOrder[userTypeB]) return 1

      // If userType is same, sort alphabetically by name
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
      return 0
    })
    setUsers(sortedUsers)
  }

  const handleSubmit = async (email, userType) => {
    try {
      const response = await fetch(`/user/updateUserType`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, userType })
      })

      if (!response.ok) {
        throw new Error('Failed to update user type')
      }
      fetchUserData()
    } catch (error) {
      console.error('Error updating user type:', error)
    } finally {
      const userTypeResponse = await api.get(
        `/user/${localStorage.getItem('loggedInUserEmail')}`
      )
      const userTypeData = userTypeResponse.data
      const userTypeown = userTypeData.userType
      localStorage.setItem('userType', userTypeown)
      const storedUserType = localStorage.getItem('userType')
      if (!storedUserType || storedUserType !== 'admin') {
        // If userType is not found or not "admin", redirect to the home page
        navigate('/')
      }
    }
  }

  const statusColorMap = {
    admin: 'success',
    volunteer: 'primary',
    standard: 'secondary',
    movievolunteer: 'danger',
    ticketvolunteer: 'warning'
  }

  const getKeyValue = (item, key) => {
    switch (key) {
      case 'name':
        return <div className="font-semibold">{item.name}</div>
      case 'email':
        return item.email
      case 'designation':
        return item.designation
      case 'Role':
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[item.usertype]}
            size="sm"
            variant="flat"
          >
            {item.usertype}
          </Chip>
        )
      case 'actions':
        return (
          <div className="relative flex justify-start items-center ">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                    />
                  </svg>
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    handleSubmit(item.email, 'admin')
                  }}
                >
                  Admin
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    handleSubmit(item.email, 'volunteer')
                  }}
                >
                  Volunteer
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    handleSubmit(item.email, 'movievolunteer')
                  }}
                >
                  Movie Volunteer
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    handleSubmit(item.email, 'ticketvolunteer')
                  }}
                >
                  Ticket Volunteer
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    handleSubmit(item.email, 'standard')
                  }}
                >
                  Standard
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )
      default:
        return item.userType
    }
  }

  const columns = ['name', 'email', 'designation', 'Role', 'actions']

  const RoleOptions = [
    { uid: 1, name: 'Admin' },
    { uid: 2, name: 'ticket volunteer' },
    { uid: 3, name: 'movie volunteer' },
    { uid: 4, name: 'standard' },
    { uid: 5, name: 'volunteer' }
  ]

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 font-monts">
        <div className="flex justify-start gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: 'w-full sm:max-w-[44%]',
              inputWrapper: 'border-1'
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            }
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue('')}
            onValueChange={(value) => setFilterValue(value)}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  }
                  size="sm"
                  variant="flat"
                >
                  Role
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={roleFilter}
                selectionMode="multiple"
                onSelectionChange={setRoleFilter}
              >
                {RoleOptions.map((Role) => (
                  <DropdownItem key={Role.uid} className="capitalize">
                    {Role.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    )
  })
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(filterValue.toLowerCase()) &&
      user.usertype in roleFilter
  )

  return (
    <div className="flex justify-center min-h-lvh">
      <Table
        isStriped
        className="w-4/5 max-sm:w-[95%] my-5"
        aria-label="Controlled table example with dynamic content"
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader
          className="capitalize"
          columns={columns.map((column) => ({ key: column, label: column }))}
        >
          {(column) => (
            <TableColumn className="capitalize" key={column.key}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={filteredUsers}>
          {(item) => (
            <TableRow key={item._id}>
              {columns.map((columnKey) => (
                <TableCell key={columnKey}>
                  {getKeyValue(item, columnKey)}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default AddDropVolunteer
