import React from "react";
import { List, Icon } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { logoutUser } from "../../utils/authUser";

function SideMenu({ user: { unreadNotification, email, unreadMessage, username }, pc, tablet }) {
  const router = useRouter();
  const isActive = route => router.pathname === route;

  return (
    <List
      style={{ paddingTop: "1rem" }}
      size="big"
      verticalAlign="middle"
      selection>
      <Link href="/">
        <List.Item active={isActive("/")}>
          <Icon name="home" size="large"
            {...(isActive('/') && { color: 'teal' })}
          />
          {pc && <List.Content>
            <List.Header content="Home" />
          </List.Content>}
        </List.Item>
      </Link>
      <br />

      <List.Item title="Messages" active={isActive("/messages")} as="a" href="/messages">
        <Icon
          name="mail outline"
          size="large"
          {...(isActive("/messages") && { color: "teal" }) || (unreadMessage && { color: "orange" })}
        />
        {pc && <List.Content><List.Header content="Messages" /></List.Content>}
      </List.Item>
      <br />

      <List.Item as="a" href="/notifications" title="Notifications" active={isActive("/notifications")}>
        <Icon
          name="bell outline"
          size="large"
          {...(isActive("/notifications") && { color: "teal" }) || (unreadNotification && { color: "orange" })}
        />
        {pc && <List.Content>
          <List.Header content="Notifications" />
        </List.Content>}
      </List.Item>
      <br />

      <List.Item as="a" title="Account" href={`/${username}`} active={router.query.username === username}>
        <Icon
          name="user"
          size="large"
          {...(router.query.username === username && { color: 'teal' })}
        />
        {pc && <List.Content>
          <List.Header content="Account" />
        </List.Content>}
      </List.Item>
      <br />

      {tablet &&
        <>
          <List.Item title="Search" active={isActive("/search")} as="a" href="/search">
            <Icon
              name="search"
              size="large"
              {...(isActive('/search') && { color: 'teal' })}
            />
          </List.Item>
          <br />
        </>
      }

      <List.Item title="Logout" onClick={() => logoutUser(email)}>
        <Icon name="log out" size="large" />
        {pc && <List.Content>
          <List.Header content="Logout" />
        </List.Content>}
      </List.Item>
    </List>
  );
}

export default SideMenu;
