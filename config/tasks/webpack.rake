namespace :webpack do
  desc 'Install dependencies with yarn'
  task :install do
    on roles(:app) do
      within fetch(:yarn_target_path, release_path) do
        execute :yarn, 'install'
      end
    end
  end

  desc 'Build webpack project as production'
  task :build_production do
    on roles(:app) do
      within fetch(:yarn_target_path, release_path) do
        execute :yarn, 'run build.prod'
      end
    end
  end

  desc 'Build webpack project as staging'
  task :build_staging do
    on roles(:app) do
      within fetch(:yarn_target_path, release_path) do
        execute :yarn, 'run build.staging'
      end
    end
  end
end

after 'deploy:symlink:linked_dirs', 'webpack:install'
